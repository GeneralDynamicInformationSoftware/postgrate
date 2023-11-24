import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs/promises';
import pkg from 'pg';
import readline from 'readline/promises';

export default async function () {
  await createMigrationTable();
  await fetchHistoricMigrations();
  await runMigrations();

  return pool.end();
}

interface IHandleConfirmationInput {
  pendingMigrations: string[];
}

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.PG_DATABASE_URL });
const client = await pool.connect();
const historicMigrations = new Set();

const migrationsTableQuery = `
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT migrations_name_unique UNIQUE (name)
  );
`;

async function createMigrationTable(): Promise<void> {
  await pool.query(migrationsTableQuery);
}

async function fetchHistoricMigrations(): Promise<void> {
  const { rows } = await pool.query('SELECT name FROM migrations');
  rows.forEach((row) => historicMigrations.add(row.name));
}

async function getMigrationFileNames(): Promise<string[]> {
  const files = await fs.readdir('db/migrations');
  return files.sort(
    (a, b) => parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]),
  );
}

async function determinePendingMigrations(): Promise<string[]> {
  const files = await getMigrationFileNames();
  const pendingMigrations = files.filter(
    (file) => !historicMigrations.has(file),
  );
  return pendingMigrations;
}

async function handleConfirmation({
  pendingMigrations,
}: IHandleConfirmationInput): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(
    `\nThe following migrations will be executed:\n\n\t${pendingMigrations.join(
      '\n\t',
    )}.\n\nDo you want to continue? (y/n): `,
  );

  if (answer !== 'y') {
    console.log('\n🚫 Aborting migration 🚫\n');
    pool.end();
    process.exit(0);
  }

  rl.close();
}

async function runMigration(migration: string): Promise<void> {
  const filePath = `db/migrations/${migration}`;
  const file = await fs.readFile(filePath, 'utf-8');
  await client.query(file);
  const { rows } = await client.query(
    'INSERT INTO migrations (name) VALUES ($1) RETURNING id;',
    [migration],
  );
  console.log(`\tMigration ${migration} [id: ${rows[0].id}] has been executed`);
}

async function runMigrations(): Promise<void> {
  const pendingMigrations = await determinePendingMigrations();

  if (!pendingMigrations.length) {
    console.log('No migrations to run');
    pool.end();
    process.exit(0);
  }

  if (process.env.NODE_ENV !== 'production')
    await handleConfirmation({ pendingMigrations });

  try {
    await client.query('BEGIN');
    console.log('\n');

    for (const migration of pendingMigrations) {
      await runMigration(migration);
    }

    console.log('\n');
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.log(`
      The following error prevented your migrations from being run:

      ${e}
    `);
  } finally {
    client.release();
  }
}
