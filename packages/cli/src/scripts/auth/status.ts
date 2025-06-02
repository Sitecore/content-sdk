import { CommandModule } from 'yargs';
import { auth } from '@sitecore-content-sdk/core/tools';
let { readTenantInfo, renewAuthIfExpired } = auth;

export const unitMock = (formModule: any) => {
  readTenantInfo = formModule.readTenantInfo || readTenantInfo;
  renewAuthIfExpired = formModule.renewAuthIfExpired || renewAuthIfExpired;
};

export const status: CommandModule = {
  command: 'status',
  describe: 'Show current status of active tenant',
  handler: async () => {
    const context = await renewAuthIfExpired();

    if (!context) {
      console.log('\n No valid authentication found. Please login.');
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
