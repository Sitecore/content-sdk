import { Argv } from 'yargs';

import * as build from './build.js';
import * as component from './component/index.js';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv) {
  return yargs.command({
    command: 'project',
    describe: 'Performs project level operations',
    builder: (_yargs: Argv) => {
      _yargs = _yargs
        .command([build, component] as any)
        .strict()
        .demandCommand(1, 'You need to specify a command to run');

      return _yargs;
    },
    handler: () => {},
  });
}
