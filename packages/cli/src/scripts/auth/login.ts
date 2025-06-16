import { Argv, CommandModule } from 'yargs';
import { TenantArgs, auth } from '@sitecore-content-sdk/core/tools';
import { constants } from '@sitecore-content-sdk/core';

let {
  setActiveTenant,
  writeTenantAuthInfo,
  writeTenantInfo,
  clientCredentialsFlow,
  getRefreshAccessToken,
  pollForDeviceToken,
  startDeviceAuthFlow,
} = auth;

export const unitMock = (formModule: any) => {
  setActiveTenant = formModule.setActiveTenant;
  writeTenantAuthInfo = formModule.writeTenantAuthInfo;
  writeTenantInfo = formModule.writeTenantInfo;
  clientCredentialsFlow = formModule.clientCredentialsFlow;
  getRefreshAccessToken = formModule.getRefreshAccessToken;
  pollForDeviceToken = formModule.pollForDeviceToken;
  startDeviceAuthFlow = formModule.startDeviceAuthFlow;
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
    const {
      DEFAULT_SITECORE_AUTH_DOMAIN,
      DEFAULT_SITECORE_AUTH_AUDIENCE,
      DEFAULT_SITECORE_AUTH_BASE_URL,
    } = constants;
    const {
      clientId,
      clientSecret,
      organizationId,
      tenantId: inputTenantId,
      audience = DEFAULT_SITECORE_AUTH_AUDIENCE,
      authority = DEFAULT_SITECORE_AUTH_DOMAIN,
      baseUrl = DEFAULT_SITECORE_AUTH_BASE_URL,
    } = argv;

    let authResponse;
    let tenantId;
    let tenantName;
    let orgId;

    try {
      if (clientSecret) {
        console.log('\n Using Client Credentials Flow...');

        const { data, tokenTenantId, tokenOrgId, tokenTenantName } = await clientCredentialsFlow({
          clientId,
          clientSecret,
          organizationId,
          tenantId: inputTenantId,
          audience,
          authority,
          baseUrl,
        });

        authResponse = data;
        tenantId = tokenTenantId;
        orgId = tokenOrgId;
        tenantName = tokenTenantName;
      } else {
        console.log('\n Using Device Code Flow...');

        if (!inputTenantId) {
          throw new Error('\n Tenant ID is required for Device Code Flow.');
        }

        if (!organizationId) {
          throw new Error('\n Organization ID is required for Device Code Flow.');
        }

        const deviceAuthData = await startDeviceAuthFlow({
          clientId,
          audience,
          authority,
          baseUrl,
        });

        const {
          deviceCode,
          userCode,
          verificationUri,
          verificationUriComplete,
          interval,
        } = deviceAuthData;

        console.log('\n🔐 Device Authorization Started');
        if (verificationUriComplete) {
          console.log(
            `\n 👉 Open the following URL to authenticate:\n  ${verificationUriComplete}`
          );
        } else {
          console.log(`👉 Visit: ${verificationUri}`);
          console.log(`🔑 Then enter the code: ${userCode}`);
        }

        const { refresh_token } = await pollForDeviceToken({
          clientId,
          deviceCode,
          authority,
          interval,
        });

        // The initial device code flow does not support custom claims (e.g., tenantId, organizationId),
        // which are required for proper token validation in our multi-tenant system.
        // To include these claims, we immediately use the returned refresh_token to request a new
        // access token with tenantId and organizationId explicitly provided.
        authResponse = await getRefreshAccessToken({
          clientId,
          refreshToken: refresh_token,
          tenantId: inputTenantId,
          organizationId,
          authority,
        });

        tenantId = inputTenantId;
        orgId = organizationId;
        tenantName = authResponse.tenantName;

        console.log('\n Device Authorization Completed');
      }

      await writeTenantAuthInfo(tenantId || inputTenantId, {
        expires_at: new Date(Date.now() + authResponse.expires_in * 1000).toISOString(),
        ...authResponse,
      });

      await writeTenantInfo({
        tenantId,
        organizationId: orgId,
        clientId,
        tenantName,
        authority,
        audience,
        baseUrl,
      });

      setActiveTenant(tenantId);

      console.log(`\n Logged in successfully to tenant: ${tenantId}`);
    } catch (error) {
      console.error(`\n Login failed: ${(error as Error).message}`);
      process.exit(1);
    }
  },
};
