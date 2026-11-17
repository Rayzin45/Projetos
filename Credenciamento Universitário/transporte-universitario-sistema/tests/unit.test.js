import test from 'node:test';
import assert from 'node:assert/strict';
import {hashPassword,verifyPassword,date,time,email,routeInput} from '../src/logic.js';

test('senha usa hash scrypt com sal aleatório e valida credenciais',async()=>{
  const one=await hashPassword('Segredo@123'),two=await hashPassword('Segredo@123');
  assert.match(one,/^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  assert.notEqual(one,two);
  assert.equal(await verifyPassword('Segredo@123',one),true);
  assert.equal(await verifyPassword('errada',one),false);
  assert.equal(await verifyPassword('Segredo@123','invalido'),false);
});
test('datas e horas inválidas são rejeitadas',()=>{
  assert.equal(date('2026-11-14'),'2026-11-14');
  assert.throws(()=>date('2026-02-30'),/inexistente/i);
  assert.throws(()=>date('14/11/2026'),/inválida/i);
  assert.throws(()=>time('25:90'),/inválido/i);
  assert.equal(time('18:30'),'18:30');
  assert.equal(email('  A@Exemplo.com '),'a@exemplo.com');
});
test('rotas válidas preservam ordem e horário',()=>{
  const r=routeInput([{vehicleId:1,driverId:3,departureTime:'18:30',universityIds:[2,4,1],notes:''}]);
  assert.deepEqual(r[0].universityIds,[2,4,1]);
  assert.equal(r[0].departureTime,'18:30');
});
test('uma universidade não aparece em dois ônibus no mesmo dia',()=>{
  assert.throws(()=>routeInput([
    {vehicleId:1,universityIds:[1,2],departureTime:'18:30'},
    {vehicleId:2,universityIds:[2,3],departureTime:'19:00'}
  ]),/Universidade atribuída a mais de um veículo/);
});
test('motorista e veículo não podem se repetir no planejamento',()=>{
  assert.throws(()=>routeInput([
    {vehicleId:1,driverId:5,universityIds:[1],departureTime:'18:30'},
    {vehicleId:2,driverId:5,universityIds:[2],departureTime:'19:00'}
  ]),/Motorista atribuído/);
  assert.throws(()=>routeInput([
    {vehicleId:1,universityIds:[1],departureTime:'18:30'},
    {vehicleId:1,universityIds:[2],departureTime:'19:00'}
  ]),/Veículo duplicado/);
});
