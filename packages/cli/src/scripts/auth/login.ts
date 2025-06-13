import { Argv, CommandModule } from 'yargs';
import { auth, TenantArgs } from '@sitecore-content-sdk/core/tools';
import { constants } from '@sitecore-content-sdk/core';

let { setActiveTenant, writeTenantAuthInfo, writeTenantInfo, clientCredentialsFlow } = auth;

export const unitMock = (authModule: any) => {
  setActiveTenant = authModule.setActiveTenant;
  writeTenantAuthInfo = authModule.writeTenantAuthInfo;
  writeTenantInfo = authModule.writeTenantInfo;
  clientCredentialsFlow = authModule.clientCredentialsFlow;
};

export const login: CommandModule<object, TenantArgs> = {
  command: 'login',
  describe: 'Login into a tenant',
  builder: (yargs: Argv<object>): Argv<TenantArgs> =>
    yargs
      .option('clientId', {
        type: 'string',
        requiresArg: true,
        demandOption: true,
        describe: 'Client ID for authentication',
      })
      .option('clientSecret', {
        type: 'string',
        demandOption: false,
        describe: 'Client secret for authentication',
      })
      .option('tenantId', {
        type: 'string',
        demandOption: false,
        describe: 'Tenant ID to login into.',
      })
      .option('organizationId', {
        type: 'string',
        demandOption: false,
        describe: 'Organization ID to authenticate against.',
      })
      .option('authority', {
        type: 'string',
        demandOption: false,
        describe: 'OAuth 2.0 authority URL for authentication.',
      })
      .option('audience', {
        type: 'string',
        demandOption: false,
        describe: 'Intended recipient of the token, usually the API base URL.',
      })
      .option('baseUrl', {
        type: 'string',
        demandOption: false,
        describe: 'Base URL for the API, used to construct the audience.',
      })
      .group(
        [
          'clientId',
          'clientSecret',
          'tenantId',
          'organizationId',
          'authority',
          'audience',
          'baseUrl',
        ],
        'Login Options:'
      ),

  handler: async (argv: TenantArgs) => {
    const { clientId } = argv;

    let authResult, tenantId, organizationId, tenantName;

    const {
      DEFAULT_SITECORE_AUTH_DOMAIN,
      DEFAULT_SITECORE_AUTH_AUDIENCE,
      DEFAULT_SITECORE_AUTH_BASE_URL,
    } = constants;

    if (argv.clientSecret) {
      try {
        const authData = await clientCredentialsFlow({
          clientId,
          clientSecret: argv.clientSecret,
          organizationId: argv.organizationId,
          tenantId: argv.tenantId,
          audience: argv.audience,
          authority: argv.authority,
          baseUrl: argv.baseUrl,
        });

        authResult = authData.data;
        tenantId = authData.tokenTenantId;
        organizationId = authData.tokenOrgId;
        tenantName = authData.tokenTenantName;
      } catch (err) {
        console.error(`\n Login failed: ${(err as Error).message}`);
        process.exit(1);
      }
    } else {
      // TODO: Implement Device Authorization Flow when clientSecret is not provided.
      console.log('\n Please provide client secret for authentication.');
      process.exit(1);
    }

    await writeTenantAuthInfo(tenantId, {
      clientSecret: argv.clientSecret,
      access_token: authResult.access_token,
      expires_in: authResult.expires_in,
      expires_at: new Date(Date.now() + authResult.expires_in * 1000).toISOString(),
    });

    await writeTenantInfo({
      tenantId,
      organizationId,
      clientId,
      tenantName,
      authority: argv.authority || DEFAULT_SITECORE_AUTH_DOMAIN,
      audience: argv.audience || DEFAULT_SITECORE_AUTH_AUDIENCE,
      baseUrl: argv.baseUrl || DEFAULT_SITECORE_AUTH_BASE_URL,
    });

    setActiveTenant(tenantId);

    console.info(`\n Logged in successfully to tenant ${tenantId}.`);
  },
};
