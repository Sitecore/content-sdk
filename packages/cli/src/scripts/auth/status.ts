import { CommandModule } from 'yargs';
import { readTenantInfo } from '../../utils/auth/tenant-store';
import { renewAuthIfExpired } from '../../utils/auth/renewal';

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

    console.info('\n Active tenant:');
    console.table([
      {
        tenant_id: context.tenantId,
        tenant_name: tenantInfo?.tenantName || 'N/A',
        organization_id: tenantInfo?.organizationId || 'N/A',
        client_id: tenantInfo?.clientId || 'N/A',
      },
    ]);
  },
};
