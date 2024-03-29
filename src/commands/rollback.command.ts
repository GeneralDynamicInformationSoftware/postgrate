import fs from 'fs/promises';
import fsSync from 'fs';
import { confirmation, pool } from '../modules/index.js';
import Config, { IConfig } from '../config.js';

export default async function (migrationId: string) {
  validate(migrationId);
  const config = Config();
  const name = await getMigrationRecordName({ id: migrationId, config });
  checkRollbackFileExists({ name, config });
  await confirmation(name);
  await rollback({ name, migrationId, config });
  pool.end();
}

interface IRollback {
  name: string;
  migrationId: string;
  config: IConfig;
}

function validate(migrationId?: string): void {
  if (!migrationId) {
    console.error('\n❗️ You must provide a migration ID to rollback ❗️\n');
    process.exit(1);
  }
}

async function getMigrationRecordName({
  id,
  config,
}: {
  id: string;
  config: IConfig;
}): Promise<string> {
  const { rows } = await pool.query(
    `SELECT * FROM ${config.migrationsTableName} WHERE id = $1`,
    [id],
  );

  if (!rows.length) {
    console.error(`\nMigration with id ${id} not found!\n`);
    process.exit(1);
  }

  return rows[0].name;
}

function checkRollbackFileExists({
  name,
  config: { rootDirectory, rollbacksDirectory },
}: {
  name: string;
  config: IConfig;
}): void {
  if (!fsSync.existsSync(`${rootDirectory}/${rollbacksDirectory}/rb-${name}`)) {
    console.error(`Rollback file ${name} does not exist`);
    process.exit(1);
  }
}

async function rollback({
  name,
  migrationId,
  config: { rootDirectory, migrationsTableName, rollbacksDirectory },
}: IRollback): Promise<void> {
  const rollback = await fs.readFile(
    `${rootDirectory}/${rollbacksDirectory}/rb-${name}`,
    'utf-8',
  );
  await pool.query(rollback);
  await pool.query(`DELETE FROM ${migrationsTableName} WHERE id = $1`, [
    migrationId,
  ]);
  console.log(`\nMigration ${name} rolled back\n`);
}
