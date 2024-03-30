#!/usr/bin/env node
import { parser } from './modules/index.js';

const args = process.argv.slice(2);
const [command, second] = args;

await parser({ command, second });

process.exit(0);
