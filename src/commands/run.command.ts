import fs from 'fs/promises';
import fsSync from 'fs';
import init from './init.command.js';
import { confirmation, pool } from '../modules/index.js';
import Config, { IConfig } from '../config.js';

export default async function () {
  const config = Config();
  await createMigrationTable(config);
  await fetchHistoricMigrations(config);
  await runMigrations(config);

  return pool.end();
}

const client = await pool.connect();
const historicMigrations = new Set();

async function createMigrationTable({
  migrationsTableName,
}: IConfig): Promise<void> {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS ${migrationsTableName} (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT migrations_name_unique UNIQUE (name)
  );
`);
}

async function fetchHistoricMigrations({
  migrationsTableName,
}: IConfig): Promise<void> {
  const { rows } = await pool.query(`SELECT name FROM ${migrationsTableName}`);
  rows.forEach((row) => historicMigrations.add(row.name));
}

async function getMigrationFileNames({
  rootDirectory,
  migrationsDirectory,
}: IConfig): Promise<string[]> {
  if (!fsSync.existsSync(`${rootDirectory}/${migrationsDirectory}`)) {
    init();
  }
  const files = await fs.readdir(`${rootDirectory}/${migrationsDirectory}`);
  return files.sort(
    (a, b) => parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]),
  );
}

async function determinePendingMigrations(config: IConfig): Promise<string[]> {
  const files = await getMigrationFileNames(config);
  const pendingMigrations = files.filter(
    (file) => !historicMigrations.has(file),
  );
  return pendingMigrations;
}

async function runMigration({
  migration,
  config: { rootDirectory, migrationsDirectory, migrationsTableName },
}: {
  migration: string;
  config: IConfig;
}): Promise<void> {
  const filePath = `${rootDirectory}/${migrationsDirectory}/${migration}`;
  const file = await fs.readFile(filePath, 'utf-8');
  await client.query(file);
  const { rows } = await client.query(
    `INSERT INTO ${migrationsTableName} (name) VALUES ($1) RETURNING id;`,
    [migration],
  );
  console.log(
    `\tMigration ${migration} [id: ${rows[0].id}] has been executed 🚀`,
  );
}

async function transact({
  pendingMigrations,
  config,
}: {
  pendingMigrations: string[];
  config: IConfig;
}): Promise<void> {
  try {
    await client.query('BEGIN');
    console.log('\n');

    for (const migration of pendingMigrations) {
      await runMigration({ migration, config });
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

async function runMigrations(config: IConfig): Promise<void> {
  const pendingMigrations = await determinePendingMigrations(config);

  if (!pendingMigrations.length) {
    console.log('\nNo migrations to run\n');
    pool.end();
    process.exit(0);
  }

  await confirmation(pendingMigrations);
  await transact({ pendingMigrations, config });
}
