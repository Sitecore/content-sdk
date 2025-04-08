import { Argv } from 'yargs';
import { AuthConfig } from '../utils/auth-config';
import { CSEnvironemntService } from '../utils/environment-service';

export type EnvironmentArgs = {
  authConfig?: AuthConfig;
};

export function builder(yargs: Argv<EnvironmentArgs>) {
  return yargs.command('environment', 'Manage environment related operations', (yargs) => {
    return (
      yargs
        .usage('Usage: sc-tools environment <subcommand>')
        .command(
          'list',
          'list environments',
          (_yargs) => {},
          async (argv) => {
            if (!argv.authConfig || !argv.authConfig.access_token) {
              console.error('No authentification found. Please login first.');
              return;
            }
            const environmentService = new CSEnvironemntService({
              accessToken: argv.authConfig.access_token,
            });

            const environemnts = await environmentService.getEnvironments();
            console.table(environemnts, ['id', 'name', 'source']);
          }
        )
        // If no subcommand is provided, show the help text with available subcommands.
        .demandCommand(1, 'Please provide a valid environment subcommand (login, logout, switch)')
        .help()
    );
  });
}
