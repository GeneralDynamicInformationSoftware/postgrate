#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();
import { help, init, list, make, rollback, run } from './commands/index.js';

const args = process.argv.slice(2);
const [command, second] = args;

switch (command) {
  case '-i':
  case 'init':
    init();
    break;

  case '-m':
  case 'make':
    make(second);
    break;

  case '-r':
  case 'run':
    await run();
    break;

  case '-rb':
  case 'rollback':
    await rollback(second);
    break;

  case '-l':
  case 'list':
    await list();
    break;

  case '-h':
  case 'help':
    help();
    break;

  default:
    console.log('Invalid command');
    help();
    process.exit(1);
    break;
}

process.exit(0);
