import fs from 'fs';

export default function (name: string): void {
  if (!name) {
    console.error('Please provide a name for the migration');
    process.exit(1);
  }

  const fileName = generateMigrationFileName(name);
  const migrationFilePath = `db/migrations/${fileName}`;
  const rollbackFilePath = `db/rollbacks/${fileName}`;

  fs.writeFileSync(migrationFilePath, '');
  fs.writeFileSync(rollbackFilePath, '');

  console.log(
    `
Migration + rollback file created: ${fileName}
`,
  );
}

function generateMigrationFileName(name: string): string {
  const timestamp = new Date().getTime();
  const fileName = `${timestamp}-${name}.sql`;
  return fileName;
}
