import config from '../config.js';
import pool from '../modules/pool.module.js';

export default async function () {
  const { migrationsTableName } = config();

  const { rows } = await pool.query(
    `SELECT name, id, created_at FROM ${migrationsTableName} ORDER BY id DESC`,
  );

  if (!rows.length) {
    console.log('\nNo migrations found!\n');
    return;
  }

  console.log('\nMigrations:\n');
  rows.forEach((row) => {
    const date = new Date(row.created_at).toLocaleDateString();
    console.log(`> ID: ${row.id}, Name: ${row.name} Created: ${date}`);
  });
  console.log('');
}
