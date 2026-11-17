import test from 'node:test';
import assert from 'node:assert/strict';

const enabled=process.env.RUN_INTEGRATION==='true';
const BASE=process.env.APP_URL||'http://localhost:3000';
async function request(url,method='GET',body,cookie='') {
  const headers={};if(body!==undefined)headers['Content-Type']='application/json';if(cookie)headers.Cookie=cookie;
  const r=await fetch(BASE+'/api'+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]||''};
}
async function login(email,password){const r=await request('/auth/login','POST',{email,password});assert.equal(r.status,200,JSON.stringify(r.data));return r.cookie;}
test('Integração HTTP real com Express e PostgreSQL', {skip:!enabled && 'Ative RUN_INTEGRATION=true com Docker/servidor executando'},async()=>{
  const health=await request('/health');assert.equal(health.status,200);assert.equal(health.data.data.database,'connected');
  const failed=await request('/auth/login','POST',{email:'aluno@transporte.local',password:'senha-errada'});assert.equal(failed.status,401);
  const student=await login('aluno@transporte.local','Aluno@12345');
  const who=await request('/me','GET',undefined,student);assert.equal(who.data.data.role,'student');
  const unauthorized=await request('/students','GET',undefined,student);assert.equal(unauthorized.status,403);
  const mine=await request('/routes/mine?date='+new Date().toISOString().slice(0,10),'GET',undefined,student);assert.equal(mine.status,200);
  const admin=await login('admin@transporte.local','Admin@12345');
  const [universities,vehicles,drivers]=await Promise.all([
    request('/universities','GET',undefined,admin),request('/vehicles','GET',undefined,admin),request('/drivers','GET',undefined,admin)
  ]);
  assert.ok(universities.data.data.length>=3);assert.ok(vehicles.data.data.length>=2);
  assert.ok(drivers.data.data.length>=1);
  const day='2099-01-05',v=vehicles.data.data[0].id,u=universities.data.data[0].id,d=drivers.data.data[0].id;
  try{
    const put=await request('/routes/day/'+day,'PUT',{plans:[{vehicleId:Number(v),driverId:Number(d),departureTime:'18:30',universityIds:[Number(u)]}]},admin);
    assert.equal(put.status,200,JSON.stringify(put.data));
    const lookup=await request(`/routes/lookup?date=${day}&universityId=${u}`,'GET',undefined,student);
    assert.equal(lookup.status,200);assert.equal(Number(lookup.data.data.stops[0].university_id),Number(u));
    const bad=await request('/routes/day/'+day,'PUT',{plans:[
      {vehicleId:Number(v),departureTime:'18:30',universityIds:[Number(u)]},
      {vehicleId:Number(vehicles.data.data[1].id),departureTime:'19:00',universityIds:[Number(u)]}
    ]},admin);
    assert.equal(bad.status,400);
    // Dados anteriores preservados após rejeição.
    const after=await request('/routes?date='+day,'GET',undefined,admin);assert.equal(after.data.data.length,1);
  }finally{
    const clean=await request('/routes/day/'+day,'PUT',{plans:[]},admin);
    assert.equal(clean.status,200,JSON.stringify(clean.data));
  }
});
