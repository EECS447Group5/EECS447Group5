import { neon, NeonQueryFunction, Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

if (process.env.NODE_ENV !== 'production') {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error("DB_URL is not defined in .env file");
}

const globalForPool = global as unknown as { pool: Pool };

export const pool = globalForPool.pool || new Pool({
  connectionString: process.env.DB_URL,
  max: 1,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
  ssl: {
      rejectUnauthorized: false
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPool.pool = pool;
}

export const sql: NeonQueryFunction<false, false> = neon(connectionString);