import fsSync from 'fs';
import fs from 'fs/promises';
import Config from '../config.js';
import { confirmation, pool } from '../modules/index.js';

export default async function (seedName?: string, resetOption?: boolean) {
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
    const resetFilePath = `${rootDirectory}/${seedDirectory}/reset.sql`;
    if (!fsSync.existsSync(resetFilePath) && resetOption) {
      console.error(`reset.sql does not exist!`);
      process.exit(1);
    }
    if (resetOption) {
      await confirmation([`${seedName}.sql`, 'reset.sql']);
    } else {
      await confirmation(`${seedName}.sql`);
    }
    if (resetOption) {
      const seed = await fs.readFile(resetFilePath, 'utf-8');
      await pool.query(seed);
    }
    const seed = await fs.readFile(seedFilePath, 'utf-8');
    await pool.query(seed);
    if (resetOption) {
      console.log(`\nDatabase truncated\n`);
    }
    console.log(`\nDatabase seeded\n`);
    pool.end();
  } else {
    console.error(`Please provide a seed file name!`);
    process.exit(1);
  }
}
