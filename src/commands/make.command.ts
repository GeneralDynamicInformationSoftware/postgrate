import fs from 'fs';
import init from './init.command.js';
import config, { IConfig } from '../config.js';

export default function (name: string): void {
  if (!name) {
    console.error('Please provide a name for the migration');
    process.exit(1);
  }

  const {
    rootDirectory,
    migrationsDirectory,
    rollbacksDirectory,
    autoCreateRollbacks,
    migrationsTableName,
  } = config();

  const fileName = generateMigrationFileName({
    name,
    config: {
      rootDirectory,
      migrationsDirectory,
      rollbacksDirectory,
      autoCreateRollbacks,
      migrationsTableName,
    },
  });

  const migrationFilePath = `${rootDirectory}/${migrationsDirectory}/${fileName}`;
  const rollbackFilePath = `${rootDirectory}/${rollbacksDirectory}/rb-${fileName}`;

  fs.writeFileSync(migrationFilePath, '');
  if (autoCreateRollbacks) fs.writeFileSync(rollbackFilePath, '');

  console.log(
    `
Migration + rollback file created: ${fileName}
`,
  );
}

function generateMigrationFileName({
  name,
  config,
}: {
  name: string;
  config: IConfig;
}): string {
  if (!fs.existsSync(`${config.rootDirectory}/${config.migrationsDirectory}`)) {
    init();
  }
  const timestamp = new Date().getTime();
  const fileName = `${timestamp}-${name}.sql`;
  return fileName;
}
