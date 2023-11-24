#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();
import { init, make, rollback, run } from './commands/index.js';

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
    run();
    break;

  case '-rb':
  case 'rollback':
    await rollback(second);
    break;

  default:
    console.log('Invalid command');
    process.exit(1);
    break;
}

process.exit(0);
