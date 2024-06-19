#!/usr/bin/env node
import { parser } from './modules/index.js';

const args = process.argv.slice(2);
const [command, second, third] = args;

await parser({ command, second, third });

process.exit(0);
