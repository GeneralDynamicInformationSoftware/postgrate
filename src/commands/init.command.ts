import fs from 'fs';
export default function (): void {
  if (!fs.existsSync('db')) {
    fs.mkdirSync('db');
  }

  if (!fs.existsSync('db/migrations')) {
    fs.mkdirSync('db/migrations', { recursive: true });
  }

  if (!fs.existsSync('db/rollbacks')) {
    fs.mkdirSync('db/rollbacks');
  }

  console.log(`
✨ Initialized postgrate & created \`db\` folder at root of project directory! ✨
`);
}
