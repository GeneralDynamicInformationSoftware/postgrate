import fs from 'node:fs/promises';
import fsSync from 'fs';
import Config, { IConfig } from '../config.js';

export default async function (path: string, name?: string): Promise<void> {
  try {
    const config = Config();
    const { rootDirectory, migrationsDirectory } = config;

    validate({ path, name, config });

    const files = await fs.readdir(path);
    const contents = await Promise.all(
      files.map((file) => fs.readFile(`${path}/${file}`, 'utf-8')),
    );
    const migration = contents.join('\n\n');

    await fs.writeFile(
      `${rootDirectory}/${migrationsDirectory}/${name}`,
      migration,
    );

    console.info(`
✨ Composed \`${path}/*.sql\` into ${name}! ✨
`);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

function validate({
  path,
  name,
  config,
}: {
  path: string;
  name?: string;
  config: IConfig;
}): void {
  if (!path) {
    console.error(
      'Please provide the path to the directory containing the `.sql` files you would like to compose',
    );
    process.exit(1);
  }

  if (!name) {
    console.error(
      'Please provide the name of the migration you would like to compose into.',
    );
    process.exit(1);
  }

  checkMigrationFileExists({ name, config });
  checkPathExists({ path });
}

function checkMigrationFileExists({
  name,
  config: { rootDirectory, migrationsDirectory },
}: {
  name: string;
  config: IConfig;
}): void {
  if (!fsSync.existsSync(`${rootDirectory}/${migrationsDirectory}/${name}`)) {
    console.error(`Migration file ${name} does not exist`);
    process.exit(1);
  }
}

function checkPathExists({ path }: { path: string }): void {
  if (!fsSync.existsSync(path)) {
    console.error(`\`${path}\` does not exist`);
    process.exit(1);
  }
}
