import { Argv } from 'yargs';

import * as scaffold from './scaffold';

import * as generateMap from './generate-map';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv) {
  return yargs.command({
    command: 'component',
    describe: 'Performs component level operations',
    builder: (_yargs: Argv) => {
      _yargs = _yargs
        .command([scaffold, generateMap] as any)
        .strict()
        .demandCommand(1, 'You need to specify a command to run');

      _yargs = scaffold.builder(_yargs as any);

      return _yargs;
    },
    handler: () => {},
  });
}
