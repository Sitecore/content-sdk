import { Argv } from 'yargs';
import * as verify from './verify';
import * as update from './update';
import * as validate from './validate';

export const command = ['atoms', 'a'];

export const describe = 'Manage atom version locks and validate atom contracts';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv) {
  return yargs
    .command([verify, update, validate] as any)
    .strict()
    .demandCommand(1, 'You need to specify an atoms subcommand (verify, update, validate)');
}

export function handler() {}

