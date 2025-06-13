import { CommandModule } from 'yargs';
import { auth } from '@sitecore-content-sdk/core/tools';
let { readTenantInfo, validateAndRenewAuthIfExpired } = auth;

export const unitMock = (authModule: any) => {
  readTenantInfo = authModule.readTenantInfo || readTenantInfo;
  validateAndRenewAuthIfExpired =
    authModule.validateAndRenewAuthIfExpired || validateAndRenewAuthIfExpired;
};

export const status: CommandModule = {
  command: 'status',
  describe: 'Show current status of active tenant',
  handler: async () => {
    const context = await validateAndRenewAuthIfExpired();

    if (!context) {
      console.log('\nNo valid authentication found. Please login.');
      return;
    }

    const tenantInfo = await readTenantInfo(context.tenantId);

    console.log('\n Active tenant:');
    console.log(`  Tenant ID       : ${context.tenantId}`);
    console.log(`  Tenant Name     : ${tenantInfo?.tenantName || 'N/A'}`);
    console.log(`  Organization ID : ${tenantInfo?.organizationId}`);
    console.log(`  Client ID       : ${tenantInfo?.clientId}`);
    console.log(`  Authority       : ${tenantInfo?.authority || 'N/A'}`);
    console.log(`  Audience        : ${tenantInfo?.audience || 'N/A'}`);
    console.log(`  Base URL        : ${tenantInfo?.baseUrl || 'N/A'}`);
  },
};
