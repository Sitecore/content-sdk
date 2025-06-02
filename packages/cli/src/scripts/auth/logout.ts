import { CommandModule } from 'yargs';
import { auth } from '@sitecore-content-sdk/core/tools';

let { deleteTenantAuthInfo, getActiveTenant, clearActiveTenant } = auth;

export const unitMock = (formModule: any) => {
  deleteTenantAuthInfo = formModule.deleteTenantAuthInfo || deleteTenantAuthInfo;
  getActiveTenant = formModule.getActiveTenant || getActiveTenant;
  clearActiveTenant = formModule.clearActiveTenant || clearActiveTenant;
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

    clearActiveTenant();
    deleteTenantAuthInfo(tenantId);

    console.info(`\n Logged out from tenant ${tenantId}`);
  },
};
