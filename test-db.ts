// Test database connection
import postgres from 'postgres';

const connectionString =
  'postgresql://admin:password123@localhost:5432/ecommerce_ai';

async function testConnection() {
  try {
    const sql = postgres(connectionString);
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    await sql.end();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
