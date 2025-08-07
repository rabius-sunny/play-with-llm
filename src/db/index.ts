import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// Database connection
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://admin:password123@localhost:5432/ecommerce_ai';

let sql: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

try {
  sql = postgres(connectionString);
  db = drizzle(sql, { schema });
} catch (error) {
  console.error('Database connection failed:', error);
  throw error;
}

export { db };
export * from './schema';
