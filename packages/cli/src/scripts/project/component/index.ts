import { Argv } from 'yargs';

import * as scaffold from './scaffold.js';
import * as generateMap from './generate-map.js';

export const command = 'component';
export const describe = 'Performs component level operations';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv) {
  return yargs
    .command([scaffold, generateMap] as any)
    .strict()
    .demandCommand(1, 'You need to specify a command to run');
}
