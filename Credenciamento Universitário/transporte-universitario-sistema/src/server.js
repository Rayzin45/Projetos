import app from './app.js';
import {pool} from './db.js';
const port=Number(process.env.PORT||3000);
const server=app.listen(port,'0.0.0.0',()=>console.log(`Transporte Universitário em http://localhost:${port}`));
for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>server.close(async()=>{await pool.end();process.exit(0);}));
