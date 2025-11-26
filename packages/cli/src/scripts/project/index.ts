import { Argv } from 'yargs';

import * as build from './build';
import * as component from './component';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv) {
  return yargs.command({
    command: ['project', 'p'],
    describe: 'Performs project level operations',
    builder: (_yargs: Argv) => {
      _yargs = _yargs
        .command([build, component] as any)
        .strict()
        .demandCommand(1, 'You need to specify a command to run');

      _yargs = component.builder(_yargs as any);

      return _yargs;
    },
    handler: () => {},
  });
}
