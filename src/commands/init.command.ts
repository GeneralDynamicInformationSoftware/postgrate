import fs from 'fs';
import config from '../config.js';

export default function (createConfigFile = false): void {
  if (createConfigFile) {
    fs.writeFileSync(
      '.postgraterc',
      JSON.stringify(
        {
          rootDirectory: 'db',
          migrationsDirectory: 'migrations',
          rollbacksDirectory: 'rollbacks',
          autoCreateRollbacks: true,
          migrationsTableName: 'migrations',
        },
        null,
        2,
      ),
    );
  }

  const {
    rootDirectory,
    migrationsDirectory,
    rollbacksDirectory,
    autoCreateRollbacks,
  } = config();

  if (!fs.existsSync(rootDirectory)) {
    fs.mkdirSync(rootDirectory);
  }

  if (!fs.existsSync(`${rootDirectory}/${migrationsDirectory}`)) {
    fs.mkdirSync(`${rootDirectory}/${migrationsDirectory}`, {
      recursive: true,
    });
  }

  if (
    !fs.existsSync(`${rootDirectory}/${rollbacksDirectory}`) &&
    autoCreateRollbacks
  ) {
    fs.mkdirSync(`${rootDirectory}/${rollbacksDirectory}`);
  }

  console.log(`
✨ Initialized postgrate & created \`${rootDirectory}\` folder at root of project directory! ✨
`);
}
