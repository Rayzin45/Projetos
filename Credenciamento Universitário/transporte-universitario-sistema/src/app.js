import express from 'express';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
import {q, transaction} from './db.js';
import {sha256,hashPassword,verifyPassword,bad,str,email,id,date,time,positiveInt,routeInput} from './logic.js';

const app=express();
app.disable('x-powered-by');
app.set('trust proxy',process.env.TRUST_PROXY==='true'?1:false);
app.use((req,res,next)=>{
  res.set('X-Content-Type-Options','nosniff');
  res.set('Referrer-Policy','strict-origin-when-cross-origin');
  res.set('X-Frame-Options','DENY');
  res.set('Content-Security-Policy',"frame-ancestors 'none'");
  next();
});
app.use(express.json({limit:'64kb'}));
app.use('/api',(req,res,next)=>{
  if(['POST','PUT','PATCH','DELETE'].includes(req.method)){
    const origin=req.get('origin');
    const expected=`${req.protocol}://${req.get('host')}`;
    if(origin && origin!==expected) return res.status(403).json({error:'Origem da requisição não permitida.'});
  }
  next();
});
const cookieName='tu_session';
const SESSION_HOURS=8;
const yes=(res,data,status=200)=>res.status(status).json({data});
const getBody=req=>req.body && typeof req.body==='object' && !Array.isArray(req.body)?req.body:{};
const bool=v=>typeof v==='boolean'?v:(()=>{throw bad('O campo ativo deve ser booleano.');})();
function setCookie(res,token,clear=false){
  const attrs=[`${cookieName}=${clear?'':token}`,'HttpOnly','SameSite=Lax','Path=/'];
  if(process.env.NODE_ENV==='production')attrs.push('Secure');
  attrs.push(`Max-Age=${clear?0:SESSION_HOURS*3600}`);
  res.append('Set-Cookie',attrs.join('; '));
}
const cookieToken=req=>{const raw=req.headers.cookie||'';const pair=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='));return pair?pair.slice(cookieName.length+1):null;};
async function auth(req,res,next){
  try{
    const token=cookieToken(req);
    if(!token||!/^[a-f0-9]{64}$/.test(token))return res.status(401).json({error:'Faça login para continuar.'});
    const {rows}=await q(`SELECT u.id,u.name,u.email,u.role,u.active,s.university_id,s.course,d.phone AS driver_phone
      FROM sessions se JOIN users u ON u.id=se.user_id
      LEFT JOIN students s ON s.user_id=u.id LEFT JOIN drivers d ON d.user_id=u.id
      WHERE se.token_hash=$1 AND se.expires_at>NOW() AND u.active=TRUE`,[sha256(token)]);
    if(!rows.length)return res.status(401).json({error:'Sessão expirada ou usuário inativo.'});
    req.user=rows[0];next();
  }catch(err){next(err);}
}
const role=(...allowed)=>(req,res,next)=>allowed.includes(req.user?.role)?next():res.status(403).json({error:'Acesso não autorizado para este perfil.'});
const admin=role('admin');
const ids=p=>id(p,'Identificador');
const ensureMail=async (c, data, roleName)=>{
  const name=str(data.name,'Nome',120), mail=email(data.email), password=str(data.password,'Senha',160);
  const hash=await hashPassword(password);
  const r=await c.query('INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id',[name,mail,hash,roleName]);
  return r.rows[0].id;
};
const userPatch=async(c,userId,data)=>{
  const fields=[str(data.name,'Nome',120),email(data.email),bool(data.active)];
  if(data.password){ const hash=await hashPassword(data.password);await c.query('UPDATE users SET name=$1,email=$2,active=$3,password_hash=$4 WHERE id=$5', [...fields,hash,userId]); }
  else await c.query('UPDATE users SET name=$1,email=$2,active=$3 WHERE id=$4',[...fields,userId]);
};
const studentSelect=`SELECT u.id,u.name,u.email,u.active,s.course,s.phone,s.university_id,un.name AS university_name
  FROM students s JOIN users u ON u.id=s.user_id JOIN universities un ON un.id=s.university_id`;
const driverSelect=`SELECT u.id,u.name,u.email,u.active,d.phone FROM drivers d JOIN users u ON u.id=d.user_id`;

app.get('/api/health',async(req,res)=>{try{await q('SELECT 1');yes(res,{status:'ok',database:'connected'});}catch{res.status(503).json({error:'Banco de dados indisponível.'});}});
const loginAttempts=new Map();
app.post('/api/auth/login',async(req,res)=>{
  const body=getBody(req);
  const mail=email(body.email), password=str(body.password,'Senha',160);
  const source=req.ip || 'unknown';
  const record=loginAttempts.get(source)||{count:0,until:0};
  if(record.until>Date.now() && record.count>=12)throw bad('Muitas tentativas. Aguarde 15 minutos.',429);
  const {rows}=await q('SELECT id,password_hash,active FROM users WHERE LOWER(email)=$1',[mail]);
  const candidate=rows[0];
  const valid=candidate?.active && await verifyPassword(password,candidate.password_hash);
  if(!valid){
    const count=(record.until>Date.now()?record.count:0)+1;
    loginAttempts.set(source,{count,until:Date.now()+15*60*1000});
    throw bad('E-mail ou senha inválidos.',401);
  }
  loginAttempts.delete(source);
  const token=randomBytes(32).toString('hex');
  await q('DELETE FROM sessions WHERE expires_at<=NOW()');
  await q("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,NOW()+INTERVAL '8 hours')",[sha256(token),candidate.id]);
  setCookie(res,token);
  yes(res,{message:'Login realizado.'});
});
app.post('/api/auth/logout',auth,async(req,res)=>{const token=cookieToken(req);await q('DELETE FROM sessions WHERE token_hash=$1',[sha256(token)]);setCookie(res,'',true);yes(res,{message:'Sessão encerrada.'});});
app.get('/api/me',auth,(req,res)=>yes(res,req.user));

app.get('/api/universities',auth,async(req,res)=>yes(res,(await q('SELECT id,name,address,active FROM universities ORDER BY name')).rows));
app.post('/api/universities',auth,admin,async(req,res)=>{const b=getBody(req);const r=await q('INSERT INTO universities(name,address) VALUES($1,$2) RETURNING *',[str(b.name,'Nome',120),str(b.address??'','Endereço',200,false)]);yes(res,r.rows[0],201);});
app.put('/api/universities/:id',auth,admin,async(req,res)=>{const b=getBody(req);const r=await q('UPDATE universities SET name=$1,address=$2,active=$3 WHERE id=$4 RETURNING *',[str(b.name,'Nome',120),str(b.address??'','Endereço',200,false),bool(b.active),ids(req.params.id)]);if(!r.rowCount)throw bad('Universidade não encontrada.',404);yes(res,r.rows[0]);});
app.delete('/api/universities/:id',auth,admin,async(req,res)=>{const r=await q('DELETE FROM universities WHERE id=$1 RETURNING id',[ids(req.params.id)]);if(!r.rowCount)throw bad('Universidade não encontrada.',404);yes(res,{deleted:true});});

app.get('/api/vehicles',auth,async(req,res)=>yes(res,(await q('SELECT * FROM vehicles ORDER BY id')).rows));
app.post('/api/vehicles',auth,admin,async(req,res)=>{const b=getBody(req);const r=await q('INSERT INTO vehicles(name,plate,model,capacity) VALUES($1,$2,$3,$4) RETURNING *',[str(b.name,'Nome',80),str(b.plate,'Placa',12).toUpperCase(),str(b.model??'','Modelo',80,false),positiveInt(b.capacity,'Capacidade')]);yes(res,r.rows[0],201);});
app.put('/api/vehicles/:id',auth,admin,async(req,res)=>{const b=getBody(req);const r=await q('UPDATE vehicles SET name=$1,plate=$2,model=$3,capacity=$4,active=$5 WHERE id=$6 RETURNING *',[str(b.name,'Nome',80),str(b.plate,'Placa',12).toUpperCase(),str(b.model??'','Modelo',80,false),positiveInt(b.capacity,'Capacidade'),bool(b.active),ids(req.params.id)]);if(!r.rowCount)throw bad('Veículo não encontrado.',404);yes(res,r.rows[0]);});
app.delete('/api/vehicles/:id',auth,admin,async(req,res)=>{const r=await q('DELETE FROM vehicles WHERE id=$1 RETURNING id',[ids(req.params.id)]);if(!r.rowCount)throw bad('Veículo não encontrado.',404);yes(res,{deleted:true});});

app.get('/api/students',auth,admin,async(req,res)=>yes(res,(await q(studentSelect+' ORDER BY u.name')).rows));
app.post('/api/students',auth,admin,async(req,res)=>{const b=getBody(req);const result=await transaction(async c=>{
  const userId=await ensureMail(c,b,'student');
  await c.query('INSERT INTO students(user_id,university_id,course,phone) VALUES($1,$2,$3,$4)',[userId,id(b.universityId,'Universidade'),str(b.course??'','Curso',120,false),str(b.phone??'','Telefone',30,false)]);
  return userId;
});yes(res,{id:result},201);});
app.put('/api/students/:id',auth,admin,async(req,res)=>{const b=getBody(req),userId=ids(req.params.id);
  await transaction(async c=>{const r=await c.query('SELECT 1 FROM students WHERE user_id=$1',[userId]);if(!r.rowCount)throw bad('Universitário não encontrado.',404);await userPatch(c,userId,b);await c.query('UPDATE students SET university_id=$1,course=$2,phone=$3 WHERE user_id=$4',[id(b.universityId,'Universidade'),str(b.course??'','Curso',120,false),str(b.phone??'','Telefone',30,false),userId]);});yes(res,{updated:true});});
app.delete('/api/students/:id',auth,admin,async(req,res)=>{const userId=ids(req.params.id);const r=await q("DELETE FROM users WHERE id=$1 AND role='student' RETURNING id",[userId]);if(!r.rowCount)throw bad('Universitário não encontrado.',404);yes(res,{deleted:true});});

app.get('/api/drivers',auth,admin,async(req,res)=>yes(res,(await q(driverSelect+' ORDER BY u.name')).rows));
app.post('/api/drivers',auth,admin,async(req,res)=>{const b=getBody(req);const userId=await transaction(async c=>{
  const uid=await ensureMail(c,b,'driver');await c.query('INSERT INTO drivers(user_id,phone) VALUES($1,$2)',[uid,str(b.phone??'','Telefone',30,false)]);return uid;
});yes(res,{id:userId},201);});
app.put('/api/drivers/:id',auth,admin,async(req,res)=>{const b=getBody(req),uid=ids(req.params.id);await transaction(async c=>{const r=await c.query('SELECT 1 FROM drivers WHERE user_id=$1',[uid]);if(!r.rowCount)throw bad('Motorista não encontrado.',404);await userPatch(c,uid,b);await c.query('UPDATE drivers SET phone=$1 WHERE user_id=$2',[str(b.phone??'','Telefone',30,false),uid]);});yes(res,{updated:true});});
app.delete('/api/drivers/:id',auth,admin,async(req,res)=>{const r=await q("DELETE FROM users WHERE id=$1 AND role='driver' RETURNING id",[ids(req.params.id)]);if(!r.rowCount)throw bad('Motorista não encontrado.',404);yes(res,{deleted:true});});

async function plansOn(day,client=q){
  const exec=typeof client==='function'?client:(sql,params)=>client.query(sql,params);
  const plans=(await exec(`SELECT r.id,r.service_date,r.vehicle_id,r.driver_id,to_char(r.departure_time,'HH24:MI') AS departure_time,r.notes,
       v.name AS vehicle_name,v.capacity,v.plate,u.name AS driver_name
    FROM route_plans r JOIN vehicles v ON v.id=r.vehicle_id LEFT JOIN users u ON u.id=r.driver_id
    WHERE r.service_date=$1 ORDER BY v.name`,[day])).rows;
  if(!plans.length)return [];
  const stops=(await exec(`SELECT rs.route_plan_id,rs.university_id,rs.position,un.name AS university_name
    FROM route_stops rs JOIN universities un ON un.id=rs.university_id
    WHERE rs.route_plan_id=ANY($1::bigint[]) ORDER BY rs.route_plan_id,rs.position`,[plans.map(p=>p.id)])).rows;
  return plans.map(p=>({...p,stops:stops.filter(s=>s.route_plan_id===p.id)}));
}
app.get('/api/routes',auth,admin,async(req,res)=>yes(res,await plansOn(date(req.query.date))));
app.get('/api/routes/mine',auth,async(req,res)=>{
  const day=date(req.query.date);
  if(req.user.role==='admin')return yes(res,await plansOn(day));
  const plans=await plansOn(day);
  const own=req.user.role==='student'?plans.find(p=>p.stops.some(s=>Number(s.university_id)===Number(req.user.university_id))) : plans.find(p=>Number(p.driver_id)===Number(req.user.id));
  yes(res,own||null);
});
app.get('/api/routes/lookup',auth,role('student','admin'),async(req,res)=>{
  const day=date(req.query.date),uid=id(req.query.universityId,'Universidade');
  const plans=await plansOn(day);
  yes(res,plans.find(p=>p.stops.some(s=>Number(s.university_id)===uid))||null);
});
app.put('/api/routes/day/:date',auth,admin,async(req,res)=>{
  const day=date(req.params.date),plans=routeInput(getBody(req).plans);
  await transaction(async c=>{
    // Serializa operações da mesma data, inclusive quando a data ainda não possui rotas.
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1)::bigint)',['routes:'+day]);
    const vids=plans.map(p=>p.vehicleId),dids=plans.filter(p=>p.driverId).map(p=>p.driverId),uids=plans.flatMap(p=>p.universityIds);
    const validV=(await c.query('SELECT id FROM vehicles WHERE active=TRUE AND id=ANY($1::bigint[])',[vids])).rows;
    const validD=(await c.query(`SELECT d.user_id AS id FROM drivers d JOIN users u ON u.id=d.user_id WHERE u.active=TRUE AND d.user_id=ANY($1::bigint[])`,[dids])).rows;
    const validU=(await c.query('SELECT id FROM universities WHERE active=TRUE AND id=ANY($1::bigint[])',[uids])).rows;
    if(validV.length!==vids.length||validD.length!==dids.length||validU.length!==uids.length)throw bad('Veículo, motorista ou universidade inexistente/inativo.');
    await c.query('DELETE FROM route_plans WHERE service_date=$1',[day]);
    for(const p of plans){
      if(!p.universityIds.length)continue;
      const route=(await c.query('INSERT INTO route_plans(service_date,vehicle_id,driver_id,departure_time,notes) VALUES($1,$2,$3,$4,$5) RETURNING id',[day,p.vehicleId,p.driverId,p.departureTime,p.notes])).rows[0];
      for(let j=0;j<p.universityIds.length;j++)await c.query('INSERT INTO route_stops(route_plan_id,university_id,position) VALUES($1,$2,$3)',[route.id,p.universityIds[j],j+1]);
    }
  });
  yes(res,{date:day,plans:await plansOn(day)});
});

app.get('/api/notices',auth,async(req,res)=>yes(res,(await q('SELECT n.id,n.title,n.message,n.created_at,u.name AS author FROM notices n JOIN users u ON u.id=n.created_by ORDER BY n.created_at DESC,n.id DESC LIMIT 100')).rows));
app.post('/api/notices',auth,admin,async(req,res)=>{const b=getBody(req);const r=await q('INSERT INTO notices(title,message,created_by) VALUES($1,$2,$3) RETURNING id',[str(b.title,'Título',120),str(b.message,'Mensagem',1000),req.user.id]);yes(res,r.rows[0],201);});
app.delete('/api/notices/:id',auth,admin,async(req,res)=>{const r=await q('DELETE FROM notices WHERE id=$1 RETURNING id',[ids(req.params.id)]);if(!r.rowCount)throw bad('Aviso não encontrado.',404);yes(res,{deleted:true});});
app.get('/api/calendar',auth,async(req,res)=>{
  const month=req.query.month;
  if(typeof month!=='string'||!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))throw bad('Mês inválido (AAAA-MM).');
  yes(res,(await q("SELECT * FROM calendar_events WHERE event_date >= $1::date AND event_date < ($1::date+INTERVAL '1 month') ORDER BY event_date,id",[month+'-01'])).rows);
});
app.post('/api/calendar',auth,admin,async(req,res)=>{const b=getBody(req);if(!['feriado','funcionamento','suspensao','outro'].includes(b.type))throw bad('Tipo de evento inválido.');const r=await q('INSERT INTO calendar_events(event_date,description,type,created_by) VALUES($1,$2,$3,$4) RETURNING *',[date(b.date),str(b.description,'Descrição',200),b.type,req.user.id]);yes(res,r.rows[0],201);});
app.delete('/api/calendar/:id',auth,admin,async(req,res)=>{const r=await q('DELETE FROM calendar_events WHERE id=$1 RETURNING id',[ids(req.params.id)]);if(!r.rowCount)throw bad('Evento não encontrado.',404);yes(res,{deleted:true});});
app.get('/api/support',auth,async(req,res)=>{
  const isAdmin=req.user.role==='admin';if(!isAdmin&&req.user.role!=='student')throw bad('Apenas universitários e administradores acessam o suporte.',403);
  const sql=`SELECT t.*,u.name AS requester FROM support_tickets t JOIN users u ON u.id=t.user_id ${isAdmin?'':'WHERE t.user_id=$1'} ORDER BY t.created_at DESC,t.id DESC`;
  yes(res,(await q(sql,isAdmin?[]:[req.user.id])).rows);
});
app.post('/api/support',auth,role('student'),async(req,res)=>{const b=getBody(req);const r=await q('INSERT INTO support_tickets(user_id,subject,message) VALUES($1,$2,$3) RETURNING id',[req.user.id,str(b.subject,'Assunto',150),str(b.message,'Mensagem',2000)]);yes(res,r.rows[0],201);});
app.patch('/api/support/:id',auth,admin,async(req,res)=>{const b=getBody(req);if(!['aberto','em_atendimento','resolvido'].includes(b.status))throw bad('Status inválido.');const r=await q('UPDATE support_tickets SET status=$1,response=$2,updated_at=NOW() WHERE id=$3 RETURNING id',[b.status,str(b.response??'','Resposta',2000,false),ids(req.params.id)]);if(!r.rowCount)throw bad('Solicitação não encontrada.',404);yes(res,{updated:true});});
app.get('/api/incidents',auth,role('admin','driver'),async(req,res)=>{const isAdmin=req.user.role==='admin';const sql=`SELECT i.*,u.name AS driver_name,v.name AS vehicle_name FROM incidents i JOIN users u ON u.id=i.driver_id LEFT JOIN vehicles v ON v.id=i.vehicle_id ${isAdmin?'':'WHERE i.driver_id=$1'} ORDER BY i.created_at DESC,i.id DESC LIMIT 100`;yes(res,(await q(sql,isAdmin?[]:[req.user.id])).rows);});
app.post('/api/incidents',auth,role('driver'),async(req,res)=>{
  const b=getBody(req),day=date(b.date),kind=str(b.type,'Tipo',40),desc=str(b.description,'Descrição',1000);
  const assigned=(await q('SELECT vehicle_id FROM route_plans WHERE driver_id=$1 AND service_date=$2',[req.user.id,day])).rows[0];
  const r=await q('INSERT INTO incidents(driver_id,vehicle_id,service_date,type,description) VALUES($1,$2,$3,$4,$5) RETURNING id',[req.user.id,assigned?.vehicle_id||null,day,kind,desc]);yes(res,r.rows[0],201);
});

app.use(express.static(resolve(dirname(fileURLToPath(import.meta.url)),'../public'),{index:'index.html'}));
app.use('/api',(req,res)=>res.status(404).json({error:'Endpoint não encontrado.'}));
app.use((err,req,res,next)=>{
  const status=err.status|| (err.code==='23505'?409:err.code==='23503'?409:err.code==='23514'?400:500);
  let message=status===500?'Erro interno do servidor.':err.message;
  if(err.code==='23505')message='Registro duplicado: e-mail, nome, placa ou atribuição já existente.';
  if(err.code==='23503')message='Operação não permitida: registro vinculado a outros dados.';
  if(err.code==='23514')message='Valor fora dos limites permitidos.';
  if(status>=500)console.error('[api]',err);
  res.status(status).json({error:message});
});
export default app;
