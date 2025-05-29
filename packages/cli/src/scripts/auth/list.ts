import { CommandModule } from 'yargs';
import { getAllTenantsInfo } from '@sitecore-content-sdk/core/tools';

export const list: CommandModule = {
  command: 'list',
  describe: 'List all known tenants',
  handler: async () => {
    const tenants = getAllTenantsInfo();

    if (tenants.length === 0) {
      console.log('\n No tenant information found.');
      return;
    }

    console.log('\n Known tenants:\n');

    tenants.forEach((tenant, index) => {
      console.log(`Tenant ${index + 1}:`);
      console.log(`  Tenant ID       : ${tenant.tenantId}`);
      console.log(`  Tenant Name     : ${tenant.tenantName || 'N/A'}`);
      console.log(`  Organization ID : ${tenant.organizationId}`);
      console.log(`  Client ID       : ${tenant.clientId}`);
      console.log(`  Authority       : ${tenant.authority || 'N/A'}`);
      console.log(`  Audience        : ${tenant.audience || 'N/A'}`);
      console.log(`  Base URL        : ${tenant.baseUrl || 'N/A'}`);
      console.log();
    });
  },
};
