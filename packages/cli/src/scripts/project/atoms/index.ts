import { Argv } from 'yargs';
import * as update from './update';
import * as validate from './validate';

export const command = ['atoms', 'a'];

export const describe = 'Manage atom version locks and validate atom contracts';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv) {
  return yargs
    .command([update, validate] as any)
    .strict()
    .demandCommand(1, 'You need to specify an atoms subcommand (update, validate)');
}
