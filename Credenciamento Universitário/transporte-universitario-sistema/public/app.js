/* Frontend sem framework: consome a API REST do Express. */
const $ = id => document.getElementById(id);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localISO = () => { const d=new Date(),pad=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
const localDate = iso => iso ? new Date(String(iso).slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR') : '—';
const nowDay=localISO();
const S={user:null,page:'dashboard',regTab:'students',edit:null,routeDate:nowDay,queryMode:'auto',queryDate:nowDay,queryUniversity:null,routeDraft:[],month:nowDay.slice(0,7),common:{universities:[],vehicles:[],notices:[]},result:undefined,noticeList:[],rows:[],calendar:[],support:[],incidents:[],mine:null,driverList:[]};
const demo={admin:['admin@transporte.local','Admin@12345'],student:['aluno@transporte.local','Aluno@12345'],driver:['motorista@transporte.local','Motorista@12345']};
const roleName={admin:'Administrador',student:'Universitário',driver:'Motorista'};
const pages={
  admin:[['dashboard','▦','Painel'],['register','▤','Cadastros'],['manage','⌁','Gerenciar rotas'],['notices','◉','Avisos'],['calendar','▦','Calendário'],['support','✉','Suporte'],['incidents','⚑','Ocorrências']],
  student:[['dashboard','⌂','Início'],['routes','⌁','Consultar rotas'],['notices','◉','Avisos'],['calendar','▦','Calendário'],['support','✉','Suporte']],
  driver:[['dashboard','⌂','Início'],['routes','⌁','Rota atribuída'],['notices','◉','Avisos'],['calendar','▦','Calendário'],['incidents','⚑','Ocorrências']]
};
const headers={dashboard:'Painel inicial',routes:'Consulta de rotas',manage:'Gerenciar rotas',register:'Cadastros',notices:'Avisos',calendar:'Calendário',support:'Suporte',incidents:'Ocorrências'};
let toastTimeout;
function toast(message,kind='good') { const t=$('toast');t.textContent=message;t.className='toast active '+kind;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.className='toast',4200); }
async function api(path,method='GET',body) {
  const response=await fetch('/api'+path,{method,credentials:'same-origin',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  let data;try{data=await response.json();}catch{throw Error('Resposta inválida do servidor.');}
  if(!response.ok){if(response.status===401 && S.user){S.user=null;showLogin();}throw Error(data.error||'Falha na requisição.');}
  return data.data;
}
function showLogin(){ $('app').classList.remove('active');$('loginScreen').classList.remove('hidden'); $('loginPassword').value=''; }
function showApp(){ $('loginScreen').classList.add('hidden');$('app').classList.add('active'); }
function loading(){ $('content').innerHTML='<div class="page-loading">⏳ Carregando informações do banco de dados...</div>'; }
const empty=(message='Nenhum registro encontrado.')=>`<div class="empty"><div class="empty-icon">◇</div>${esc(message)}</div>`;
const section=(title,subtitle,action='')=>`<div class="sectionhead"><div><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div>${action}</div>`;
const pill=(label,kind='')=>`<span class="pill ${kind}">${esc(label)}</span>`;
const badgeActive=active=>pill(active?'Ativo':'Inativo',active?'good':'bad');
const cdate=()=>S.routeDate;
const opts=(items,valueKey,labelKey,selected,includeEmpty=false)=>`${includeEmpty?'<option value="">Sem atribuição</option>':''}${items.map(item=>`<option value="${esc(item[valueKey])}" ${String(item[valueKey])===String(selected)?'selected':''}>${esc(item[labelKey])}</option>`).join('')}`;
const formText=(label,name,value='',type='text',required=true)=>`<div class="form-group"><label for="field_${esc(name)}">${esc(label)}</label><input id="field_${esc(name)}" name="${esc(name)}" type="${type}" value="${esc(value)}" ${required?'required':''} maxlength="160" placeholder="${esc(label)}"></div>`;
const formSelect=(label,name,content)=>`<div class="form-group"><label for="field_${esc(name)}">${esc(label)}</label><select id="field_${esc(name)}" name="${esc(name)}">${content}</select></div>`;
const btn=(title,action,variant='btn-outline')=>`<button class="btn ${variant}" data-go="${esc(action)}">${esc(title)}</button>`;
async function common(){ const [universities,vehicles,notices]=await Promise.all([api('/universities'),api('/vehicles'),api('/notices')]);S.common={universities,vehicles,notices}; }
function nav(){
  const items=pages[S.user.role];
  $('sideNav').innerHTML=items.map(([name,symbol,title])=>`<button class="nav-btn ${S.page===name?'active':''}" data-go="${name}"><span style="font-size:18px;width:23px;text-align:center">${symbol}</span>${esc(title)}</button>`).join('');
  $('mobileNav').innerHTML=items.map(([name,symbol,title])=>`<button class="mobile-nav ${S.page===name?'active':''}" data-go="${name}"><span class="navemoji">${symbol}</span>${esc(title)}</button>`).join('');
  $('topTitle').textContent=headers[S.page]||'Painel';
  $('topSubtitle').textContent=`${roleName[S.user.role]} · ${S.user.name}`;
  $('avatar').textContent=S.user.name.slice(0,1).toUpperCase();$('profileText').textContent=roleName[S.user.role];
}
async function go(page) {
  if(!S.user||!pages[S.user.role].some(([name])=>name===page)){toast('Tela indisponível para este perfil.','bad');return;}
  S.page=page;S.edit=null;nav();loading();
  try {await common();await load(page);draw();}catch(error){$('content').innerHTML=`<div class="inline-alert bad">${esc(error.message)}</div><button class="btn btn-outline" data-retry>Recarregar</button>`;toast(error.message,'bad');}
  window.scrollTo({top:0,behavior:'instant'});
}
async function load(page){
  switch(page){
    case 'dashboard':
      if(S.user.role==='admin'){const [students,drivers,plans]=await Promise.all([api('/students'),api('/drivers'),api('/routes?date='+nowDay)]);S.rows=students;S.driverList=drivers;S.result=plans;}
      else S.mine=await api('/routes/mine?date='+nowDay);
      break;
    case 'routes':
      if(S.user.role==='driver')S.result=await api('/routes/mine?date='+S.queryDate);
      else {S.result=S.queryMode==='auto'?await api('/routes/mine?date='+nowDay):null;S.queryUniversity??=Number(S.user.university_id||S.common.universities[0]?.id||0);}
      break;
    case 'manage':{
      const [plans,drivers]=await Promise.all([api('/routes?date='+S.routeDate),api('/drivers')]);S.driverList=drivers;
      S.routeDraft=S.common.vehicles.filter(v=>v.active).map(v=>{
        const existing=plans.find(p=>Number(p.vehicle_id)===Number(v.id));
        return {vehicleId:Number(v.id),driverId:existing?.driver_id?Number(existing.driver_id):null,departureTime:existing?.departure_time||'18:30',notes:existing?.notes||'',universityIds:existing?.stops.map(s=>Number(s.university_id))||[]};
      });break;
    }
    case 'register':await loadRegister();break;
    case 'notices':S.noticeList=await api('/notices');break;
    case 'calendar':S.calendar=await api('/calendar?month='+S.month);break;
    case 'support':S.support=await api('/support');break;
    case 'incidents':S.incidents=await api('/incidents');break;
  }
}
async function loadRegister(){S.rows=await api(({students:'/students',drivers:'/drivers',universities:'/universities',vehicles:'/vehicles'})[S.regTab]);}
function draw(){
  const fn={dashboard:dashboard,routes:routes,manage:manage,register:register,notices:notices,calendar:calendar,support:support,incidents:incidents}[S.page];
  $('content').innerHTML=fn();
}
function alert(message,kind='') {return `<div class="inline-alert ${kind}">${esc(message)}</div>`;}
function noticePreview(){return S.common.notices.length?S.common.notices.slice(0,3).map(n=>`<div class="notice-item"><strong>${esc(n.title)}</strong><p>${esc(n.message)}</p><time>Por ${esc(n.author)} · ${new Date(n.created_at).toLocaleDateString('pt-BR')}</time></div>`).join(''):empty('Sem avisos publicados.');}
function miniRoute(plan){return `<div class="route-item"><header><strong>🚌 ${esc(plan.vehicle_name)}</strong><span class="clock">${esc(plan.departure_time)}</span></header><p>${plan.stops.map(s=>esc(s.university_name)).join(' → ')}</p>${pill(`${plan.stops.length} universidades`,'good')}</div>`;}
function dashboard(){
  const role=S.user.role;
  if(role==='admin'){
    const plans=S.result;
    return section('Visão geral','Dados reais persistidos no PostgreSQL.',btn('+ Gerenciar rotas','manage','btn-accent'))+
      `<div class="cards"><div class="card metric"><div class="symbol">🚌</div><div class="count">${S.common.vehicles.length}</div><div class="caption">VEÍCULOS</div></div><div class="card metric"><div class="symbol">🎓</div><div class="count">${S.rows.length}</div><div class="caption">UNIVERSITÁRIOS</div></div><div class="card metric"><div class="symbol">⌁</div><div class="count">${plans.length}</div><div class="caption">ROTAS DE HOJE</div></div></div>`+
      `<div class="split"><div class="card"><div class="cardhead"><h3>Rotas de hoje — ${localDate(nowDay)}</h3></div><div class="route-list">${plans.map(miniRoute).join('')||empty('Nenhuma rota cadastrada para hoje.')}</div></div><div class="card"><div class="cardhead"><h3>Avisos recentes</h3></div>${noticePreview()}${btn('Abrir cadastros','register')}</div></div>`;
  }
  const p=S.mine;
  if(role==='student'){
    return section(`Olá, ${S.user.name.split(' ')[0]}!`,'Sua rota é identificada pela universidade vinculada à sua conta.')+
      `<div class="split"><div><div class="highlight"><div class="highlight-small">🚌 Rota de hoje · ${localDate(nowDay)}</div><div style="font-size:19px;font-weight:750;margin-top:12px">${p?esc(p.vehicle_name):'Sem rota cadastrada'}</div><div class="big-time">${p?esc(p.departure_time):'—'}</div><div class="highlight-small">${p?`Universidade vinculada · ${esc(p.stops.find(x=>Number(x.university_id)===Number(S.user.university_id))?.university_name||'—')}`:'Consulte outra data ou entre em contato com a administração.'}</div>${btn('Consultar rota →','routes','btn-accent')}</div><div class="dash-links"><button class="dash-tile" data-action="manual"><span>📅</span><strong>Outra data</strong><small>Consulta manual</small></button><button class="dash-tile" data-go="support"><span>✉</span><strong>Suporte</strong><small>Solicite atendimento</small></button></div></div><div class="card"><div class="cardhead"><h3>Avisos recentes</h3></div>${noticePreview()}</div></div>`;
  }
  return section(`Olá, ${S.user.name.split(' ')[0]}!`,'Seu itinerário operacional está associado ao motorista cadastrado.')+
    `<div class="split"><div><div class="highlight"><div class="highlight-small">🚌 Rota atribuída · ${localDate(nowDay)}</div><div style="font-size:21px;font-weight:750;margin-top:12px">${p?esc(p.vehicle_name):'Sem veículo atribuído'}</div><div class="big-time">${p?esc(p.departure_time):'—'}</div><div class="highlight-small">${p?esc(p.stops.map(s=>s.university_name).join(' → ')):'Solicite à administração a atribuição da rota do dia.'}</div>${btn('Ver itinerário →','routes','btn-accent')}</div><div class="dash-links"><button class="dash-tile" data-go="incidents"><span>📝</span><strong>Registrar ocorrência</strong><small>Atrasos e imprevistos</small></button><button class="dash-tile" data-go="notices"><span>📣</span><strong>Avisos</strong><small>Comunicados administrativos</small></button></div></div><div class="card"><div class="cardhead"><h3>Avisos recentes</h3></div>${noticePreview()}</div></div>`;
}
function routeDetail(plan,requestedDate) {
  if(!plan)return `<div class="card">${empty('Não há rota prevista para este veículo ou universidade na data selecionada.')}</div>`;
  return `<div class="split"><div class="card"><div class="cardhead"><h3>Resultado da consulta</h3>${pill('Rota programada','good')}</div>
    <div style="display:flex;gap:14px;align-items:center"><span style="font-size:36px">🚌</span><div><strong style="font-size:22px">${esc(plan.vehicle_name)}</strong><div class="muted-label">Veículo previsto · ${esc(plan.plate)}</div></div></div>
    <div class="highlight" style="margin:16px 0"><div class="highlight-small">Horário previsto</div><div class="big-time" style="margin:6px 0">${esc(plan.departure_time)}</div></div><strong>Sequência das universidades</strong><div class="timeline">${plan.stops.map((s,i)=>`<div class="step"><span class="dot">${i+1}</span><p>${esc(s.university_name)}</p></div>`).join('')}</div></div>
    <div class="card"><h3>Detalhes da operação</h3><p class="muted">Data: <strong>${localDate(requestedDate)}</strong></p><p class="muted">Motorista: <strong>${esc(plan.driver_name||'A definir')}</strong></p><p class="muted">Capacidade: <strong>${esc(plan.capacity)} lugares</strong></p>${alert('Horário informado pela administração, não localização em tempo real.')}</div></div>`;
}
function routes(){
  const driver=S.user.role==='driver';
  const actualDate=driver?S.queryDate:(S.queryMode==='auto'?nowDay:S.queryDate);
  let html=section(driver?'Meu itinerário':'Consultar rotas',driver?'Visualize a programação atribuída ao seu perfil.':'Consulte automaticamente a rota de sua universidade ou pesquise uma data e instituição.');
  if(!driver){
    html+=`<div class="tabs"><button class="tab ${S.queryMode==='auto'?'active':''}" data-mode="auto">Minha rota</button><button class="tab ${S.queryMode==='manual'?'active':''}" data-mode="manual">Consulta manual</button></div>`;
    if(S.queryMode==='manual')html+=`<form id="queryForm" class="card" style="margin-bottom:18px"><div class="fields"><div class="form-group"><label>Data</label><input type="date" name="date" value="${S.queryDate}" required></div>
      ${formSelect('Universidade','universityId',opts(S.common.universities.filter(x=>x.active),'id','name',S.queryUniversity))}</div><button class="btn btn-main" type="submit">Consultar rota</button></form>`;
    else html+=alert(`Consulta automática para a universidade vinculada ao cadastro (${localDate(nowDay)}).`,'good');
  }else html+=`<form id="driverDateForm" class="card" style="margin-bottom:18px"><label>Data do itinerário</label><div class="toolbar"><input type="date" name="date" value="${S.queryDate}"><button class="btn btn-main">Consultar</button></div></form>`;
  html+=routeDetail(S.result,actualDate);
  return html;
}
function manage(){
  const vehicles=S.common.vehicles.filter(v=>v.active),uni=S.common.universities.filter(u=>u.active),drivers=S.driverList.filter(d=>d.active);
  const assigned=new Set(S.routeDraft.flatMap(p=>p.universityIds.map(Number)));
  const free=uni.filter(u=>!assigned.has(Number(u.id)));
  return section('Configuração dinâmica de rotas','Associe universidades a veículos por data, defina horários e motoristas.', '<button class="btn btn-accent" data-action="saveRoutes">Salvar configuração do dia</button>')+
    `<div class="card" style="margin-bottom:18px"><div class="fields"><div class="form-group"><label>Data de operação</label><input type="date" id="manageDate" value="${S.routeDate}"></div><div class="form-group"><label>Turno</label><input value="Noturno" disabled></div></div>${alert('As mudanças ficam no banco somente ao clicar em Salvar configuração. Cada data possui distribuição independente.','good')}</div>`+
    `<div class="route-grid">${S.routeDraft.map(plan=>{
      const v=vehicles.find(x=>Number(x.id)===plan.vehicleId);
      return `<div class="route-column"><header><h3>🚌 ${esc(v?.name||'Ônibus')}</h3>${pill(`${plan.universityIds.length} universidade(s)`,plan.universityIds.length?'good':'warn')}</header>
      <div class="form-group"><label>Motorista atribuído</label><select class="route-driver" data-bus="${plan.vehicleId}">${opts(drivers,'id','name',plan.driverId,true)}</select></div>
      <div class="form-group"><label>Horário previsto</label><input class="route-time-input" type="time" data-bus="${plan.vehicleId}" value="${esc(plan.departureTime)}"></div>
      <div class="route-list">${plan.universityIds.map((uid,i)=>{
        const u=uni.find(x=>Number(x.id)===Number(uid));
        return `<div class="stop"><span class="number">${i+1}</span><span class="stop-title">${esc(u?.name||'Universidade')}</span><div class="stop-actions">
        <button class="move-btn" data-stop="up" data-bus="${plan.vehicleId}" data-index="${i}" ${i===0?'disabled':''} title="Subir">↑</button>
        <button class="move-btn" data-stop="down" data-bus="${plan.vehicleId}" data-index="${i}" ${i===plan.universityIds.length-1?'disabled':''} title="Descer">↓</button>
        <button class="move-btn" data-stop="remove" data-bus="${plan.vehicleId}" data-index="${i}" title="Retirar">×</button></div></div>`;}).join('')||empty('Sem universidades atribuídas.')}</div>
      ${free.length?`<div class="form-group" style="margin-top:14px"><label>Adicionar universidade</label><select id="addTo${plan.vehicleId}"><option value="">Selecione...</option>${opts(free,'id','name','')}</select></div><button class="btn btn-outline btn-small" data-action="addStop" data-bus="${plan.vehicleId}">+ Adicionar</button>`:''}
      </div>`;
    }).join('')}</div>`+
    `<div class="card" style="margin-top:18px"><div class="cardhead"><h3>Redistribuição entre veículos</h3>${pill('HU06 · HU07','warn')}</div><div class="fields"><div class="form-group"><label>Universidade já atribuída</label><select id="transferUni">${uni.filter(u=>assigned.has(Number(u.id))).map(u=>`<option value="${u.id}">${esc(u.name)}</option>`).join('')}</select></div><div class="form-group"><label>Veículo de destino</label><select id="transferBus">${opts(vehicles,'id','name','')}</select></div></div><button class="btn btn-main" data-action="transferStop">Redistribuir universidade</button><p class="help">A universidade será retirada do ônibus anterior e adicionada ao fim da sequência do novo ônibus. Clique em Salvar para persistir.</p></div>`;
}
const registerCfg={
  students:{title:'Universitários',description:'Cadastro de estudantes vinculados à universidade.',url:'/students'},
  drivers:{title:'Motoristas',description:'Gestão de contas e contatos dos motoristas.',url:'/drivers'},
  universities:{title:'Universidades',description:'Pontos universitários atendidos pelas rotas.',url:'/universities'},
  vehicles:{title:'Veículos',description:'Frota disponível, placa e capacidade.',url:'/vehicles'}
};
function registrationFields(){
  const e=S.edit||{},t=S.regTab;
  if(t==='students'||t==='drivers'){
    return formText('Nome completo','name',e.name||'')+formText('E-mail','email',e.email||'','email')+
      formText(S.edit?'Nova senha (opcional)':'Senha (mínimo 8 caracteres)','password','','password',!S.edit)+
      formText('Telefone','phone',e.phone||'','tel',false)+
      (t==='students'?formSelect('Universidade','universityId',opts(S.common.universities.filter(u=>u.active),'id','name',e.university_id))+
      formText('Curso','course',e.course||'','text',false):'')+
      (S.edit?formSelect('Situação','active',`<option value="true" ${e.active?'selected':''}>Ativo</option><option value="false" ${!e.active?'selected':''}>Inativo</option>`):'');
  }
  if(t==='universities')return formText('Nome da universidade','name',e.name||'')+formText('Endereço / Referência','address',e.address||'','text',false)+
    (S.edit?formSelect('Situação','active',`<option value="true" ${e.active?'selected':''}>Ativo</option><option value="false" ${!e.active?'selected':''}>Inativo</option>`):'');
  return formText('Identificação do veículo','name',e.name||'')+formText('Placa','plate',e.plate||'')+formText('Modelo','model',e.model||'','text',false)+
    formText('Capacidade','capacity',e.capacity??45,'number')+
    (S.edit?formSelect('Situação','active',`<option value="true" ${e.active?'selected':''}>Ativo</option><option value="false" ${!e.active?'selected':''}>Inativo</option>`):'');
}
function rowDescription(item){switch(S.regTab){case 'students':return item.university_name;case 'drivers':return item.phone||'Sem telefone';case 'universities':return item.address||'Sem endereço';case 'vehicles':return `${item.plate} · ${item.capacity} lugares`;}}
function register(){
  const conf=registerCfg[S.regTab];
  return section('Cadastros do sistema','Gerencie os registros necessários às rotas e aos perfis de acesso.')+
    `<div class="tabs">${Object.entries(registerCfg).map(([k,v])=>`<button class="tab ${k===S.regTab?'active':''}" data-regtab="${k}">${v.title}</button>`).join('')}</div>`+
    `<div class="split"><div class="card"><div class="cardhead"><h3>${conf.title} cadastrados</h3>${pill(`${S.rows.length} registros`)}</div><div class="table-wrap"><table class="table"><thead><tr><th>Nome / Identificação</th><th>Informações</th><th>Status</th><th>Ações</th></tr></thead>
    <tbody>${S.rows.map(item=>`<tr><td>${esc(item.name)}</td><td>${esc(rowDescription(item))}</td><td>${badgeActive(item.active)}</td><td class="actions"><button class="btn btn-outline btn-small" data-edit="${item.id}">Editar</button><button class="btn btn-danger btn-small" data-delete="${item.id}">Excluir</button></td></tr>`).join('')}</tbody></table>${S.rows.length?'':empty()}</div></div>
    <div class="card"><div class="cardhead"><h3>${S.edit?'Editar registro':'Novo cadastro'}</h3>${S.edit?'<button class="btn btn-outline btn-small" data-cancel-edit>Cancelar edição</button>':''}</div><p class="muted" style="font-size:13px">${conf.description}</p>
    <form id="registerForm">${registrationFields()}<button type="submit" class="btn btn-accent full">${S.edit?'Salvar alterações':'+ Adicionar registro'}</button></form></div></div>`;
}
function notices(){
  return section('Quadro de avisos',S.user.role==='admin'?'Publique comunicados para motoristas e universitários.':'Comunicados publicados pela administração.')+
    `<div class="${S.user.role==='admin'?'split':''}"><div class="card"><div class="cardhead"><h3>Comunicados</h3>${pill(`${S.noticeList.length} avisos`)}</div>
    ${S.noticeList.length?S.noticeList.map(item=>`<div class="notice-item"><div style="display:flex;justify-content:space-between;align-items:start;gap:10px"><strong>📣 ${esc(item.title)}</strong>${S.user.role==='admin'?`<button class="btn btn-danger btn-small" data-remove-notice="${item.id}">Excluir</button>`:''}</div><p>${esc(item.message)}</p><time>Por ${esc(item.author)} · ${new Date(item.created_at).toLocaleString('pt-BR')}</time></div>`).join(''):empty('Nenhum aviso publicado.')}</div>
    ${S.user.role==='admin'?`<div class="card"><div class="cardhead"><h3>Publicar aviso</h3></div><form id="noticeForm">${formText('Título','title')}<div class="form-group"><label>Mensagem</label><textarea name="message" maxlength="1000" required placeholder="Comunicado aos usuários..."></textarea></div><button class="btn btn-accent full">Publicar comunicado</button></form></div>`:''}</div>`;
}
const calendarTypes={feriado:'Feriado',funcionamento:'Dia de funcionamento',suspensao:'Suspensão do transporte',outro:'Outro evento'};
function calendar(){
  return section('Calendário operacional','Consulte datas relevantes para o funcionamento do transporte.')+
    `<div class="card" style="margin-bottom:18px"><form id="monthForm" class="toolbar"><label>Escolher mês</label><input class="monthpick" type="month" name="month" value="${S.month}" required><button class="btn btn-main">Consultar</button></form></div>`+
    `<div class="${S.user.role==='admin'?'split':''}"><div class="card"><div class="cardhead"><h3>Eventos de ${esc(S.month)}</h3>${pill(`${S.calendar.length} eventos`)}</div>
    ${S.calendar.length?S.calendar.map(item=>`<div class="notice-item"><div style="display:flex;gap:10px;justify-content:space-between"><strong>${localDate(item.event_date)} · ${esc(item.description)}</strong>${S.user.role==='admin'?`<button class="btn btn-danger btn-small" data-remove-event="${item.id}">Excluir</button>`:''}</div><p>${esc(calendarTypes[item.type]||item.type)}</p></div>`).join(''):empty('Não há eventos cadastrados nesse mês.')}</div>
    ${S.user.role==='admin'?`<div class="card"><div class="cardhead"><h3>Adicionar evento</h3></div><form id="eventForm"><div class="form-group"><label>Data</label><input name="date" type="date" required value="${nowDay}"></div>${formText('Descrição','description')}${formSelect('Tipo','type',Object.entries(calendarTypes).map(([k,v])=>`<option value="${k}">${v}</option>`).join(''))}<button class="btn btn-accent full">Adicionar evento</button></form></div>`:''}</div>`;
}
const supportStatus={aberto:'Aberto',em_atendimento:'Em atendimento',resolvido:'Resolvido'};
function support(){
  const isAdmin=S.user.role==='admin';
  return section('Central de suporte',isAdmin?'Responda e acompanhe solicitações dos universitários.':'Envie dúvidas ou solicitações à administração.')+
    `<div class="${isAdmin?'':'split'}"><div class="card"><div class="cardhead"><h3>${isAdmin?'Solicitações recebidas':'Minhas solicitações'}</h3>${pill(`${S.support.length} registros`)}</div>
    ${S.support.length?S.support.map(item=>`<div class="notice-item"><div style="display:flex;justify-content:space-between;gap:10px"><strong>#${item.id} · ${esc(item.subject)}</strong><span class="state-chip status-${esc(item.status)}">${esc(supportStatus[item.status])}</span></div><p>${esc(item.message)}</p>
      ${isAdmin?`<p>Solicitante: ${esc(item.requester)}</p><form class="ticketForm" data-ticket="${item.id}">${formSelect('Status','status',Object.entries(supportStatus).map(([k,v])=>`<option value="${k}" ${k===item.status?'selected':''}>${v}</option>`).join(''))}<div class="form-group"><label>Resposta</label><textarea name="response" maxlength="2000">${esc(item.response||'')}</textarea></div><button class="btn btn-main btn-small">Atualizar solicitação</button></form>`:item.response?`<div class="inline-alert good">Resposta da administração: ${esc(item.response)}</div>`:''}
      <time>${new Date(item.created_at).toLocaleString('pt-BR')}</time></div>`).join(''):empty('Nenhuma solicitação registrada.')}</div>
    ${!isAdmin?`<div class="card"><div class="cardhead"><h3>Nova solicitação</h3></div><form id="supportForm">${formText('Assunto','subject')}<div class="form-group"><label>Mensagem</label><textarea name="message" required maxlength="2000" placeholder="Como podemos ajudar?"></textarea></div><button class="btn btn-accent full">Enviar solicitação</button></form></div>`:''}</div>`;
}
function incidents(){
  const isDriver=S.user.role==='driver';
  return section(isDriver?'Registro de ocorrências':'Ocorrências registradas',isDriver?'Informe atrasos, problemas e imprevistos no transporte.':'Acompanhe as situações informadas pelos motoristas.')+
    `<div class="${isDriver?'split':''}"><div class="card"><div class="cardhead"><h3>Histórico de ocorrências</h3>${pill(`${S.incidents.length} registros`)}</div>
    ${S.incidents.length?S.incidents.map(x=>`<div class="notice-item"><strong>⚠ ${esc(x.type)} · ${esc(x.vehicle_name||'Veículo não identificado')}</strong><p>${esc(x.description)}</p><time>${localDate(x.service_date)} · Motorista: ${esc(x.driver_name)}</time></div>`).join(''):empty('Nenhuma ocorrência registrada.')}</div>
    ${isDriver?`<div class="card"><div class="cardhead"><h3>Nova ocorrência</h3></div><form id="incidentForm"><div class="form-group"><label>Data</label><input name="date" type="date" value="${nowDay}" required></div>
      ${formSelect('Tipo','type',['Atraso','Problema mecânico','Desvio de rota','Indisponibilidade','Outro'].map(x=>`<option>${x}</option>`).join(''))}
      <div class="form-group"><label>Descrição</label><textarea name="description" required maxlength="1000" placeholder="Descreva o ocorrido..."></textarea></div><button class="btn btn-accent full">Registrar ocorrência</button></form></div>`:''}</div>`;
}
async function refresh(){await common();await load(S.page);draw();}
async function handleClick(e){
  const goButton=e.target.closest('[data-go]');if(goButton){await go(goButton.dataset.go);return;}
  const demoButton=e.target.closest('[data-demo]');if(demoButton){const [email,password]=demo[demoButton.dataset.demo];$('loginEmail').value=email;$('loginPassword').value=password;return;}
  if(e.target.closest('[data-logout]')){await api('/auth/logout','POST',{});S.user=null;showLogin();toast('Sessão encerrada.');return;}
  if(e.target.closest('[data-retry]')){await go(S.page);return;}
  if(e.target.closest('[data-action="manual"]')){S.queryMode='manual';await go('routes');return;}
  const mode=e.target.closest('[data-mode]');if(mode){S.queryMode=mode.dataset.mode;await go('routes');return;}
  const tab=e.target.closest('[data-regtab]');if(tab){S.regTab=tab.dataset.regtab;S.edit=null;await loadRegister();draw();return;}
  const edit=e.target.closest('[data-edit]');if(edit){S.edit=S.rows.find(x=>String(x.id)===edit.dataset.edit)||null;draw();return;}
  if(e.target.closest('[data-cancel-edit]')){S.edit=null;draw();return;}
  const deleteBtn=e.target.closest('[data-delete]');if(deleteBtn){
    if(!confirm('Excluir este registro permanentemente? Registros vinculados podem impedir a exclusão.'))return;
    await api(registerCfg[S.regTab].url+'/'+deleteBtn.dataset.delete,'DELETE',{});
    S.edit=null;await refresh();toast('Registro excluído do banco de dados.');return;
  }
  const removeNotice=e.target.closest('[data-remove-notice]');if(removeNotice){if(!confirm('Excluir este aviso?'))return;await api('/notices/'+removeNotice.dataset.removeNotice,'DELETE',{});await refresh();toast('Aviso excluído.');return;}
  const removeEvent=e.target.closest('[data-remove-event]');if(removeEvent){if(!confirm('Excluir este evento?'))return;await api('/calendar/'+removeEvent.dataset.removeEvent,'DELETE',{});await refresh();toast('Evento excluído.');return;}
  const stop=e.target.closest('[data-stop]');if(stop){
    const plan=S.routeDraft.find(p=>p.vehicleId===Number(stop.dataset.bus)),index=Number(stop.dataset.index),cmd=stop.dataset.stop;
    if(!plan)return;
    if(cmd==='remove')plan.universityIds.splice(index,1);
    else {const destination=index+(cmd==='up'?-1:1);if(destination<0||destination>=plan.universityIds.length)return;
      [plan.universityIds[index],plan.universityIds[destination]]=[plan.universityIds[destination],plan.universityIds[index]];}
    draw();return;
  }
  const action=e.target.closest('[data-action]');if(!action)return;
  if(action.dataset.action==='addStop'){
    const plan=S.routeDraft.find(p=>p.vehicleId===Number(action.dataset.bus));const selected=$('addTo'+action.dataset.bus)?.value;
    if(!selected)throw Error('Selecione uma universidade para adicionar.');
    if(S.routeDraft.some(p=>p.universityIds.includes(Number(selected))))throw Error('Universidade já atribuída.');
    plan.universityIds.push(Number(selected));draw();return;
  }
  if(action.dataset.action==='transferStop'){
    const uni=Number($('transferUni')?.value),target=Number($('transferBus')?.value);
    if(!uni||!target)throw Error('Selecione universidade e veículo de destino.');
    const dest=S.routeDraft.find(p=>p.vehicleId===target);if(!dest)throw Error('Veículo de destino inválido.');
    S.routeDraft.forEach(p=>p.universityIds=p.universityIds.filter(x=>x!==uni));dest.universityIds.push(uni);
    draw();toast('Redistribuição aplicada. Clique em Salvar para persistir.');return;
  }
  if(action.dataset.action==='saveRoutes'){
    const payload=S.routeDraft.map(p=>({...p,driverId:p.driverId||null}));
    await api('/routes/day/'+S.routeDate,'PUT',{plans:payload});await refresh();toast('Rotas da data salvas no PostgreSQL.');return;
  }
}
async function handleSubmit(e){
  if(!['loginForm','queryForm','driverDateForm','registerForm','noticeForm','eventForm','supportForm','incidentForm','monthForm'].includes(e.target.id) && !e.target.classList.contains('ticketForm'))return;
  e.preventDefault();const f=e.target,b=Object.fromEntries(new FormData(f));
  if(f.id==='loginForm'){
    $('loginError').textContent='';
    try{await api('/auth/login','POST',b);S.user=await api('/me');showApp();await go('dashboard');}
    catch(error){$('loginError').textContent=error.message;}
    return;
  }
  try{
    if(f.id==='queryForm'){
      S.queryDate=b.date;S.queryUniversity=Number(b.universityId);
      S.result=await api('/routes/lookup?date='+encodeURIComponent(S.queryDate)+'&universityId='+S.queryUniversity);
      draw();return;
    }
    if(f.id==='driverDateForm'){
      S.queryDate=b.date;S.result=await api('/routes/mine?date='+encodeURIComponent(S.queryDate));draw();return;
    }
    if(f.id==='registerForm'){
      const path=registerCfg[S.regTab].url;
      if(S.regTab==='students')b.universityId=Number(b.universityId);
      if(S.regTab==='vehicles')b.capacity=Number(b.capacity);
      if(S.edit){b.active=b.active==='true';if(!b.password)delete b.password;await api(path+'/'+S.edit.id,'PUT',b);}
      else await api(path,'POST',b);
      S.edit=null;await refresh();toast('Cadastro salvo no PostgreSQL.');return;
    }
    if(f.id==='noticeForm'){await api('/notices','POST',b);await refresh();toast('Comunicado publicado.');return;}
    if(f.id==='eventForm'){await api('/calendar','POST',b);S.month=b.date.slice(0,7);await refresh();toast('Evento adicionado ao calendário.');return;}
    if(f.id==='supportForm'){await api('/support','POST',b);await refresh();toast('Solicitação de suporte enviada.');return;}
    if(f.classList.contains('ticketForm')){await api('/support/'+f.dataset.ticket,'PATCH',b);await refresh();toast('Atendimento atualizado.');return;}
    if(f.id==='incidentForm'){await api('/incidents','POST',b);await refresh();toast('Ocorrência registrada no banco.');return;}
    if(f.id==='monthForm'){S.month=b.month;await refresh();return;}
  }catch(error){toast(error.message,'bad');}
}
async function handleChange(e){
  const target=e.target;
  if(target.id==='manageDate'){
    if(!confirm('Trocar a data descarta alterações não salvas desta tela. Continuar?')){target.value=S.routeDate;return;}
    S.routeDate=target.value;await go('manage');return;
  }
  const bus=Number(target.dataset.bus);
  const plan=S.routeDraft.find(p=>p.vehicleId===bus);
  if(!plan)return;
  if(target.classList.contains('route-driver'))plan.driverId=target.value?Number(target.value):null;
  if(target.classList.contains('route-time-input'))plan.departureTime=target.value;
}
document.addEventListener('click',e=>handleClick(e).catch(error=>toast(error.message,'bad')));
document.addEventListener('submit',handleSubmit);
document.addEventListener('change',e=>handleChange(e).catch(error=>toast(error.message,'bad')));
(async()=>{
  try{S.user=await api('/me');showApp();await go('dashboard');}
  catch{showLogin();}
})();
