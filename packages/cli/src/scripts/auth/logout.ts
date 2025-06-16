import { CommandModule } from 'yargs';
import { auth } from '@sitecore-content-sdk/core/tools';

let { deleteTenantAuthInfo, getActiveTenant, clearActiveTenant, deleteKey } = auth;

export const unitMock = (formModule: any) => {
  deleteTenantAuthInfo = formModule.deleteTenantAuthInfo || deleteTenantAuthInfo;
  getActiveTenant = formModule.getActiveTenant || getActiveTenant;
  clearActiveTenant = formModule.clearActiveTenant || clearActiveTenant;
  deleteKey = formModule.deleteKey || deleteKey;
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

    await deleteTenantAuthInfo(tenantId);
    await deleteKey(tenantId);
    clearActiveTenant();

    console.log(`\n Logged out from tenant ${tenantId}`);
  },
};
