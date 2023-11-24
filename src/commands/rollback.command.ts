import fs from 'fs/promises';
import fsSync from 'fs';
import { confirmation, pool } from '../modules/index.js';

export default async function (migrationId: string) {
  validate(migrationId);
  const name = await getMigrationRecordName(migrationId);
  checkRollbackFileExists(name);
  await confirmation(name);
  await rollback({ name, migrationId });
  pool.end();
}

interface IRollback {
  name: string;
  migrationId: string;
}

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

async function rollback({ name, migrationId }: IRollback): Promise<void> {
  const rollback = await fs.readFile(`db/rollbacks/${name}`, 'utf-8');
  await pool.query(rollback);
  await pool.query('DELETE FROM migrations WHERE id = $1', [migrationId]);
  console.log(`\nMigration ${name} rolled back\n`);
}
