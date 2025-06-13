import { CommandModule } from 'yargs';
import { auth } from '@sitecore-content-sdk/core/tools';

let { deleteTenantAuthInfo, getActiveTenant, clearActiveTenant, deleteKey } = auth;

export const unitMock = (authModule: any) => {
  deleteTenantAuthInfo = authModule.deleteTenantAuthInfo || deleteTenantAuthInfo;
  getActiveTenant = authModule.getActiveTenant || getActiveTenant;
  clearActiveTenant = authModule.clearActiveTenant || clearActiveTenant;
  deleteKey = authModule.deleteKey || deleteKey;
};

export const logout: CommandModule = {
  command: 'logout',
  describe: 'Logout from the active tenant',
  handler: async () => {
    const tenantId = getActiveTenant();
    if (!tenantId) {
      console.error('\n No active tenant found. Please login first.');
      return;
    }

    deleteTenantAuthInfo(tenantId);
    deleteKey(tenantId);
    clearActiveTenant();

    console.info(`\n Logged out from tenant ${tenantId}`);
  },
};
