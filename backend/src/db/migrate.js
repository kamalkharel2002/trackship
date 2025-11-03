import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Running migrations...');
    
    // Read migration files in order
    const migrations = [
      '001_create_schema.sql',
      '002_create_trip_hubs_relation.sql'
    ];

    for (const migration of migrations) {
      const filePath = join(__dirname, 'migrations', migration);
      const sql = readFileSync(filePath, 'utf-8');
      console.log(`Executing ${migration}...`);
      await client.query(sql);
      console.log(`✓ ${migration} completed`);
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();

