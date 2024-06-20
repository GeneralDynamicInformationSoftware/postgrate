import {
  help,
  init,
  list,
  make,
  rollback,
  run,
  compose,
} from '../commands/index.js';

export default async ({ command, second, third }: IParserInput) => {
  switch (command) {
    case '-i':
    case 'init':
      init(true);
      break;

    case '-m':
    case 'make':
      make(second!);
      break;

    case '-r':
    case 'run':
      await run();
      break;

    case '-rb':
    case 'rollback':
      await rollback(second!);
      break;

    case '-c':
    case 'compose':
      await compose(second!, third);
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
      console.log(`Invalid command: ${command}`);
      help();
      process.exit(1);
      break;
  }
};

interface IParserInput {
  command: string;
  second?: string;
  third?: string;
}
