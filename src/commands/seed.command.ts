import fsSync from 'fs';
import fs from 'fs/promises';
import Config from '../config';
import { confirmation, pool } from '../modules';

export default async function (seedName?: string) {
  const { rootDirectory, seedDirectory } = Config();
  if (!seedDirectory) {
    console.error(`Seed directory does not exist!`);
    process.exit(1);
  }
  if (seedName) {
    const seedFilePath = `${rootDirectory}/${seedDirectory}/${seedName}.sql`;
    if (!fsSync.existsSync(seedFilePath)) {
      console.error(`${seedName}.sql does not exist!`);
      process.exit(1);
    }
    await confirmation('seed.sql');
    const seed = await fs.readFile(seedFilePath, 'utf-8');
    await pool.query(seed);
    console.log(`\nDatabase seeded\n`);
    pool.end();
  } else {
    console.error(`Please provide a seed file name!`);
    process.exit(1);
  }
}
