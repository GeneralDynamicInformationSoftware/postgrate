import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline/promises';

function getReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function abort() {
  console.log('\n🚫 Aborting migration 🚫\n');
  process.exit(0);
}

function runMessage(pendingMigrations: string[]) {
  return `\nThe following migrations will be executed:\n\n\t${pendingMigrations.join(
    '\n\t',
  )}.`;
}

function rollbackMessage(name: string) {
  return `\nThe following migration will be rolled back:\n\n\t${name}.`;
}

export default async function (references: string[] | string): Promise<void> {
  if (process.env.NODE_ENV === 'production') return;

  const rl = getReadlineInterface();

  const answer = await rl.question(
    `${
      Array.isArray(references)
        ? runMessage(references)
        : rollbackMessage(references)
    }\n\nDo you want to continue? (y/n): `,
  );

  if (answer !== 'y') {
    await abort();
  }

  rl.close();
}
