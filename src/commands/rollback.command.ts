import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import fsSync from 'fs';
import pkg from 'pg';
import readline from 'readline/promises';

export default async function (migrationId: string) {
  validate(migrationId);
  const name = await getMigrationRecordName(migrationId);
  checkRollbackFileExists(name);
  await handleConfirmation({ name });
  await rollback({ name, migrationId });
  pool.end();
  process.exit(0);
}

interface IRollback {
  name: string;
  migrationId: string;
}

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.PG_DATABASE_URL });

function validate(migrationId?: string): void {
  if (!migrationId) {
    console.error('\n❗️ You must provide a migration ID to rollback ❗️\n');
    process.exit(1);
  }
}

async function getMigrationRecordName(id: string): Promise<string> {
  const { rows } = await pool.query('SELECT * FROM migrations WHERE id = $1', [
    id,
  ]);

  if (!rows.length) {
    console.error(`\nMigration with id ${id} not found!\n`);
    process.exit(1);
  }

  return rows[0].name;
}

function checkRollbackFileExists(name: string): void {
  if (!fsSync.existsSync(`db/rollbacks/${name}`)) {
    console.error(`Rollback file ${name} does not exist`);
    process.exit(1);
  }
}

async function handleConfirmation({ name }: { name: string }): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(
    `\nThe following migration will be rolled back:\n\n\t${name}.\n\nDo you want to continue? (y/n): `
  );

  if (answer !== 'y') {
    console.log('\n🚫 Aborting migration 🚫\n');
    pool.end();
    process.exit(0);
  }

  rl.close();
}

async function rollback({ name, migrationId }: IRollback): Promise<void> {
  const rollback = await fs.readFile(`db/rollbacks/${name}`, 'utf-8');
  await pool.query(rollback);
  await pool.query('DELETE FROM migrations WHERE id = $1', [migrationId]);
  console.log(`\nMigration ${name} rolled back\n`);
}
