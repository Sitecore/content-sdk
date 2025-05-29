import { CommandModule } from 'yargs';
import {
  deleteTenantAuthInfo,
  getActiveTenant,
  clearActiveTenant,
} from '@sitecore-content-sdk/core/tools';

export const logout: CommandModule = {
  command: 'logout',
  describe: 'Logout from the active tenant',
  handler: async () => {
    const tenantId = getActiveTenant();
    if (!tenantId) {
      console.error('\n No active tenant found. Please login first.');
      return;
    }

    clearActiveTenant();
    deleteTenantAuthInfo(tenantId);

    console.info(`\n Logged out from tenant ${tenantId}`);
  },
};
