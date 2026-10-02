import { Argv } from 'yargs';

import * as list from './list';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv) {
  return yargs.command({
    command: ['experimental', 'e'],
    describe: 'Performs operations on experimental features',
    builder: (_yargs: Argv) => {
      _yargs = _yargs
        .command([list] as any)
        .strict()
        .demandCommand(1, 'You need to specify a command to run');

      _yargs = list.builder(_yargs as any);

      return _yargs;
    },
    handler: () => {},
  });
}
