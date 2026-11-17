import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {pool, transaction, q} from './db.js';
import {hashPassword} from './logic.js';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const tz=process.env.APP_TIME_ZONE||'America/Fortaleza';
const today=new Date().toLocaleDateString('sv-SE',{timeZone:tz});
const next=new Date(Date.now()+86400000).toLocaleDateString('sv-SE',{timeZone:tz});
async function seed() {
  await transaction(async c => {
    const uni=[['Faculdade A','Centro'],['Universidade B','Bairro Norte'],['Faculdade C','Bairro Sul'],['Universidade D','Centro'],['Faculdade E','Zona Leste']];
    for(const [name,address] of uni)await c.query('INSERT INTO universities(name,address) VALUES($1,$2) ON CONFLICT(name) DO NOTHING',[name,address]);
    const users=[['Administrador Demo','admin@transporte.local','admin','Admin@12345'],['Universitário Demo','aluno@transporte.local','student','Aluno@12345'],['Motorista Demo','motorista@transporte.local','driver','Motorista@12345']];
    for(const [name,email,role,password] of users){
      const hash=await hashPassword(password);
      await c.query('INSERT INTO users(name,email,role,password_hash) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[name,email,role,hash]);
    }
    const student=(await c.query("SELECT id FROM users WHERE email='aluno@transporte.local'")).rows[0]?.id;
    const driver=(await c.query("SELECT id FROM users WHERE email='motorista@transporte.local'")).rows[0]?.id;
    const admin=(await c.query("SELECT id FROM users WHERE email='admin@transporte.local'")).rows[0]?.id;
    const unis=(await c.query('SELECT id FROM universities ORDER BY id LIMIT 5')).rows.map(r=>r.id);
    if(student && unis[0])await c.query('INSERT INTO students(user_id,university_id,course) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[student,unis[0],'Sistemas de Informação']);
    if(driver)await c.query('INSERT INTO drivers(user_id,phone) VALUES($1,$2) ON CONFLICT DO NOTHING',[driver,'(99) 99999-0000']);
    for(const [name,plate,model,capacity] of [['Ônibus 01','ABC-1D23','Modelo demonstrativo',45],['Ônibus 02','EFG-4H56','Modelo demonstrativo',42]])await c.query('INSERT INTO vehicles(name,plate,model,capacity) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[name,plate,model,capacity]);
    const buses=(await c.query('SELECT id FROM vehicles ORDER BY id LIMIT 2')).rows.map(r=>r.id);
    for (const d of [today,next]){
      const exists=(await c.query('SELECT id FROM route_plans WHERE service_date=$1 LIMIT 1',[d])).rowCount>0;
      if(exists)continue;
      const templates=d===today ? [[unis.slice(0,3),'18:30',driver],[unis.slice(3,5),'19:00',null]] : [[[unis[0],unis[3]],'18:40',driver],[[unis[1],unis[2],unis[4]],'19:10',null]];
      for(let i=0;i<Math.min(buses.length,templates.length);i++){
        const [ids,time,driverId]=templates[i];
        const r=await c.query('INSERT INTO route_plans(service_date,vehicle_id,driver_id,departure_time) VALUES($1,$2,$3,$4) RETURNING id',[d,buses[i],driverId,time]);
        for(let j=0;j<ids.length;j++)await c.query('INSERT INTO route_stops(route_plan_id,university_id,position) VALUES($1,$2,$3)',[r.rows[0].id,ids[j],j+1]);
      }
    }
    if(admin){const found=(await c.query('SELECT 1 FROM notices LIMIT 1')).rowCount;
      if(!found)await c.query('INSERT INTO notices(title,message,created_by) VALUES($1,$2,$3)',['Programação do transporte','Consulte as rotas e horários previstos antes de sair. Dados fictícios para demonstração.',admin]);
      const cal=(await c.query('SELECT 1 FROM calendar_events LIMIT 1')).rowCount;
      if(!cal)await c.query('INSERT INTO calendar_events(event_date,description,type,created_by) VALUES($1,$2,$3,$4)',[today,'Operação demonstrativa do transporte','funcionamento',admin]);
    }
  });
}
try {
  console.log('Aplicando esquema PostgreSQL...');
  await q(await readFile(resolve(ROOT,'db/schema.sql'),'utf8'));
  if(process.env.SEED_DEMO==='true') {await seed();console.log('Dados de demonstração criados (sem sobrescrever dados existentes).');}
  console.log('Banco preparado.');
} catch(e) {console.error('Falha ao preparar banco:',e.message);process.exitCode=1;} finally {await pool.end();}
