import { Argv } from 'yargs';
import { login } from './login';
import { logout } from './logout';
import { status } from './status';
import { list } from './list';

/**
 * Registers the `auth` command group and its subcommands (`login`, `logout`, `status`, `list`) with Yargs.
 * @param {Argv} yargs - The Yargs instance used to define CLI commands.
 * @returns The configured Yargs command group for authentication operations.
 */
export function builder(yargs: Argv) {
  return yargs.command({
    command: 'auth',
    describe: 'Performs authentication for content services',
    builder: (_yargs: Argv) => {
      return _yargs
        .command([login, logout, status, list] as any)
        .strict()
        .demandCommand(1, 'You need to specify a command to run')
        .help();
    },
    handler: () => {},
  });
}
