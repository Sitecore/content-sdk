import { Argv, CommandModule } from 'yargs';
import { auth, TenantInfo } from '@sitecore-content-sdk/core/tools';
let { readTenantInfo, validateAndRenewAuthIfExpired, setActiveTenant } = auth;

export const unitMock = (authModule: any) => {
  readTenantInfo = authModule.readTenantInfo || readTenantInfo;
  setActiveTenant = authModule.setActiveTenant || setActiveTenant;
  validateAndRenewAuthIfExpired =
    authModule.validateAndRenewAuthIfExpired || validateAndRenewAuthIfExpired;
};

export type SwitchArgs = Pick<TenantInfo, 'tenantId'>;

export const switchTenant: CommandModule<object, SwitchArgs> = {
  command: 'switch <tenantId>',
  describe: 'Switch into another tenant that you have logged into previously',
  builder: (yargs: Argv<object>): Argv<SwitchArgs> =>
    yargs.option('tenantId', {
      type: 'string',
      demandOption: true,
      describe: 'Tenant ID to switch into.',
    }),
  handler: async (argv: SwitchArgs) => {
    const tenantId = argv.tenantId;
    if (!tenantId) {
      console.error('Please provide tenant ID to switch into.');
      return;
    }
    const currentContext = await validateAndRenewAuthIfExpired();
    if (!currentContext) {
      console.log('\nNo valid authentication found. Please login.');
      return;
    }

    if (currentContext.tenantId === tenantId) {
      console.log(`Already in tenant: ${tenantId}`);
      return;
    }

    const newTenantInfo = await readTenantInfo(tenantId);
    if (!newTenantInfo) {
      console.error(`Tenant info for ID '${tenantId}' not found in local storage.`);
      console.error(
        'Please ensure you have logged into the tenant by running the auth login command'
      );
      return;
    }
    setActiveTenant(tenantId);
    const tenantContext = validateAndRenewAuthIfExpired();
    if (!tenantContext) {
      console.error(
        `Failed to switch to tenant '${tenantId}', remaining in tenant '${currentContext.tenantId}'.`
      );
      setActiveTenant(currentContext.tenantId);
      return;
    }
    console.log(`Switched to tenant: ${tenantId}`);
  },
};
