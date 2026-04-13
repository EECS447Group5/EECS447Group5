import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error("DB_URL is not defined in .env file");
}

export const sql: NeonQueryFunction<false, false> = neon(connectionString);