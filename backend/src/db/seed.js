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

async function runSeeds() {
  const client = await pool.connect();
  try {
    console.log('Running seeds...');
    
    // Read seed files in order
    const seeds = [
      '001_seed_hubs.sql',
      '002_seed_trips.sql'
    ];

    for (const seed of seeds) {
      const filePath = join(__dirname, 'seeds', seed);
      const sql = readFileSync(filePath, 'utf-8');
      console.log(`Executing ${seed}...`);
      await client.query(sql);
      console.log(`✓ ${seed} completed`);
    }

    console.log('All seeds completed successfully!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds();

