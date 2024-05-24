import fs from 'fs/promises';
import config from '../config.js';
import pool from '../modules/pool.module.js';

export default async function () {
  const { migrationsTableName, seedDirectory } = config();

  const { rows } = await pool.query(
    `SELECT name, id, created_at FROM ${migrationsTableName} ORDER BY id DESC`,
  );

  if (!rows.length) {
    console.log('\nNo migrations found!\n');
  } else {
    console.log('\nMigrations:\n');
    rows.forEach((row) => {
      const date = new Date(row.created_at).toLocaleDateString();
      console.log(`> ID: ${row.id}, Name: ${row.name} Created: ${date}`);
    });
  }

  console.log('\n');

  if (!seedDirectory) {
    console.error(`\nNo seed directory found!\n`);
  } else {
    const files = await fs.readdir(seedDirectory);

    console.log('\nSeeds:\n');

    if (files.length === 0) {
      console.error(`\nNo seeds found in ${seedDirectory}\n`);
    } else {
      files.forEach((file) => {
        console.log(`> Name: ${file}`);
      });
    }
  }

  console.log('');
}
