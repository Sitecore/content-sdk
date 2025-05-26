import { CommandModule } from 'yargs';
import { getAllTenantsInfo } from '../../utils/auth/tenant-store';

export const list: CommandModule = {
  command: 'list',
  describe: 'List all tenants',
  handler: async () => {
    const tenants = getAllTenantsInfo();

    if (tenants.length === 0) {
      console.info('\n No tenant info found.');
      return;
    }

    console.info('\n Known tenants:');
    console.table(
      tenants.map((tenant) => ({
        tenant_id: tenant.tenantId,
        tenant_name: tenant.tenantName,
        organization_id: tenant.organizationId,
        client_id: tenant.clientId,
      }))
    );
  },
};
