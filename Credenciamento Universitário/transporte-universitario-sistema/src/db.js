import pg from 'pg';
const { Pool, types } = pg;
types.setTypeParser(1082, x => x); // DATE sem conversão de fuso
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://transporte:transporte_local@localhost:5432/transporte_universitario',
  connectionTimeoutMillis: 6000,
  idleTimeoutMillis: 30000,
  max: 12
});
export const q = (sql, params = []) => pool.query(sql, params);
export async function transaction(run) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await run(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally { client.release(); }
}
