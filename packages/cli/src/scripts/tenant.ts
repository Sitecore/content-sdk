import { Argv } from 'yargs';
import { clientCredentialsFlow, pollForToken, startDeviceAuthorization } from '../utils/auth';
import {
  deleteAuthConfig,
  readAuthConfig,
  validateAuth,
  writeAuthConfig,
} from '../utils/auth-config';

export type TenantArgs = {
  comandName: string;
};

export function builder(yargs: Argv<TenantArgs>) {
  return yargs
    .middleware(async (argv) => {
      const authConfig = await readAuthConfig();
      if (authConfig && validateAuth(authConfig)) {
        argv.authConfig = authConfig;
      } else {
        deleteAuthConfig();
      }
    })
    .command('tenant', 'Manage tenant related operations', (yargs) => {
      return (
        yargs
          .usage('Usage: sc-tools tenant <subcommand>')

          .command(
            'login',
            'Login into tenant',
            (yargs) => {
              return yargs
                .option('client_id', {
                  describe: 'Client ID for login',
                  type: 'string',
                  demandOption: true,
                })
                .option('client_secret', {
                  describe: 'Client secret for login',
                  type: 'string',
                })
                .option('tenant_id', {
                  describe: 'Tenant ID',
                  type: 'string',
                  demandOption: true,
                })
                .option('organization_id', {
                  describe: 'Organization ID',
                  type: 'string',
                  demandOption: true,
                });
            },
            async (argv) => {
              let result: { access_token: string; refresh_token?: string; expires_in: number };
              if (argv.client_secret) {
                console.log(
                  'Found Client secret argument. Proceeding with Client Credentials Flow...'
                );

                result = await clientCredentialsFlow({
                  clientId: argv.client_id,
                  clientSecret: argv.client_secret,
                  organization_id: argv.organization_id,
                  tenant_id: argv.tenant_id,
                });

                console.log('Client Credentials Flow result:', result);
              } else {
                console.log('No Client secret argument found. Proceeding with Device Code Flow...');

                const data = await startDeviceAuthorization({
                  clientId: argv.client_id,
                  organization_id: argv.organization_id,
                  tenant_id: argv.tenant_id,
                });

                console.log('device auth data:', data);

                result = await pollForToken({
                  clientId: argv.client_id,
                  deviceCode: data.device_code,
                  interval: data.interval,
                });

                console.log('Device Code Flow result:', result);
              }

              writeAuthConfig({
                clientId: argv.client_id,
                clientSecret: argv.client_secret,
                expires_at: new Date(Date.now() + result.expires_in * 1000).toISOString(),
                ...result,
              });
            }
          )
          .command(
            'logout',
            'Logout from tenant',
            (_yargs) => {},
            (_argv) => {
              deleteAuthConfig();
            }
          )
          .command(
            'status',
            'Get tenant login status',
            (_yargs) => {},
            (argv) => {
              // Handle tenant switch
              if (argv.authConfig) {
                console.log('Current login data', argv.authConfig);
              }
            }
          )
          // If no subcommand is provided, show the help text with available subcommands.
          .demandCommand(1, 'Please provide a valid tenant subcommand (login, logout, switch)')
          .help()
      );
    });
}
