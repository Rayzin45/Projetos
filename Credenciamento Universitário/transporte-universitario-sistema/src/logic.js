import {randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt = promisify(scryptCallback);
export const sha256 = text => createHash('sha256').update(text).digest('hex');
export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 160) throw bad('Senha deve ter entre 8 e 160 caracteres.');
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${key.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string') return false;
  const [scheme, salt, hex] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !/^[a-f0-9]{128}$/i.test(hex)) return false;
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(hex, 'hex');
  return timingSafeEqual(actual, expected);
}
export function bad(message, status = 400) { const error = new Error(message); error.status = status; return error; }
export function str(value, label, max = 150, required = true) {
  if (typeof value !== 'string') { if (!required && (value === undefined || value === null)) return ''; throw bad(`${label} inválido.`); }
  const s = value.trim();
  if ((required && !s) || s.length > max) throw bad(`${label} deve ter entre ${required?1:0} e ${max} caracteres.`);
  return s;
}
export function email(value) { const e = str(value, 'E-mail', 180).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw bad('E-mail inválido.'); return e; }
export function id(value, label='Identificador') { const n = Number(value); if (!Number.isSafeInteger(n) || n < 1) throw bad(`${label} inválido.`); return n; }
export function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw bad('Data inválida (AAAA-MM-DD).');
  const dt = new Date(value+'T12:00:00Z');
  if (Number.isNaN(dt.valueOf()) || dt.toISOString().slice(0,10) !== value) throw bad('Data inexistente.');
  return value;
}
export function time(value) { if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw bad('Horário inválido (HH:MM).'); return value; }
export function positiveInt(value, label, max=100) {const n=id(value,label);if(n>max)throw bad(`${label} deve ser no máximo ${max}.`);return n;}
export function routeInput(plans) {
  if(!Array.isArray(plans) || plans.length>50) throw bad('Envie uma lista válida de rotas (até 50 veículos).');
  const vehicles=new Set(), drivers=new Set(), stops=new Set();
  return plans.map(p=>{
    if (!p || typeof p!=='object') throw bad('Rota inválida.');
    const vehicleId=id(p.vehicleId,'Veículo');
    const driverId=(p.driverId===null||p.driverId===''||p.driverId===undefined)?null:id(p.driverId,'Motorista');
    if(vehicles.has(vehicleId)) throw bad('Veículo duplicado na data.'); vehicles.add(vehicleId);
    if(driverId){if(drivers.has(driverId))throw bad('Motorista atribuído a mais de um veículo.');drivers.add(driverId);}
    if(!Array.isArray(p.universityIds) || p.universityIds.length>100) throw bad('Lista de universidades inválida.');
    const universityIds=p.universityIds.map(v=>id(v,'Universidade'));
    for(const uid of universityIds){if(stops.has(uid))throw bad('Universidade atribuída a mais de um veículo na data.');stops.add(uid);}
    return {vehicleId,driverId,universityIds,departureTime:time(p.departureTime),notes:str(p.notes??'','Observação',500,false)};
  });
}
