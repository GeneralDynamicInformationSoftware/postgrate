import { expect, it, describe, vi, afterEach } from 'vitest';
import { help, init, list, make, rollback, run } from '../commands/index.js';
import { parser } from '../modules/index.js';

describe('Parser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should init upon `init` + `-i`', async () => {
    vi.mock('../commands/index.js', () => {
      return {
        init: vi.fn(),
      };
    });

    parser({ command: 'init' });
    expect(init).toHaveBeenCalledTimes(1);

    parser({ command: '-i' });
    expect(init).toHaveBeenCalledTimes(2);
  });

  it('should make upon `make` and `-m`', () => {
    vi.mock('../commands/index.js', () => {
      return {
        init: vi.fn(),
        make: vi.fn(),
      };
    });

    parser({ command: 'make', second: 'test' });
    expect(make).toHaveBeenCalledTimes(1);
    expect(make).toHaveBeenCalledWith('test');

    parser({ command: '-m', second: 'test' });
    expect(make).toHaveBeenCalledTimes(2);
    expect(make).toHaveBeenCalledWith('test');
  });

  it('should run upon `run` and `-r`', () => {
    vi.mock('../commands/index.js', () => {
      return {
        init: vi.fn(),
        make: vi.fn(),
        run: vi.fn(),
      };
    });

    parser({ command: 'run' });
    expect(run).toHaveBeenCalledTimes(1);

    parser({ command: '-r' });
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('should rollback upon `rollback` and `-rb`', () => {
    vi.mock('../commands/index.js', () => {
      return {
        init: vi.fn(),
        make: vi.fn(),
        run: vi.fn(),
        rollback: vi.fn(),
      };
    });

    parser({ command: 'rollback', second: 'test' });
    expect(rollback).toHaveBeenCalledTimes(1);
    expect(rollback).toHaveBeenCalledWith('test');

    parser({ command: '-rb', second: 'test' });
    expect(rollback).toHaveBeenCalledTimes(2);
    expect(rollback).toHaveBeenCalledWith('test');
  });

  it('should list upon `list` and `-l`', () => {
    vi.mock('../commands/index.js', () => {
      return {
        init: vi.fn(),
        make: vi.fn(),
        run: vi.fn(),
        rollback: vi.fn(),
        list: vi.fn(),
      };
    });

    parser({ command: 'list' });
    expect(list).toHaveBeenCalledTimes(1);

    parser({ command: '-l' });
    expect(list).toHaveBeenCalledTimes(2);
  });

  it('should help upon `help` and `-h`', () => {
    vi.mock('../commands/index.js', () => {
      return {
        init: vi.fn(),
        make: vi.fn(),
        run: vi.fn(),
        rollback: vi.fn(),
        list: vi.fn(),
        help: vi.fn(),
      };
    });

    parser({ command: 'help' });
    expect(help).toHaveBeenCalledTimes(1);

    parser({ command: '-h' });
    expect(help).toHaveBeenCalledTimes(2);
  });

  it('should handle invalid command', () => {
    vi.mock('../commands/index.js', () => {
      return {
        init: vi.fn(),
        make: vi.fn(),
        run: vi.fn(),
        rollback: vi.fn(),
        list: vi.fn(),
        help: vi.fn(),
      };
    });

    // @ts-ignore
    const exit = vi.spyOn(process, 'exit').mockImplementationOnce(() => {});

    parser({ command: 'invalid' });

    expect(help).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
  });
});
