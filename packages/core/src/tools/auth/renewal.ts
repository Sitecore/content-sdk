import { getActiveTenant, clearActiveTenant } from './tenant-state';
import { clientCredentialsFlow } from './flow';
import { TenantAuth, TenantInfo } from './models';
import {
  writeTenantAuthInfo,
  readTenantAuthInfo,
  deleteTenantAuthInfo,
  readTenantInfo,
} from './tenant-store';
import { deleteKey } from './encryption';

/**
 * Validates whether a given auth config is still valid (i.e., not expired).
 * @param {TenantAuth} authInfo - The tenant auth configuration.
 * @returns True if the token is still valid, false if expired.
 */
export function validateAuthInfo(authInfo: TenantAuth): boolean {
  const now = new Date();
  const expiry = new Date(authInfo.expires_at);
  return now < expiry;
}

/**
 * Renews the token for a given tenant using stored credentials.
 * @param {TenantAuth} authInfo - Current authentication info for the tenant.
 * @param {TenantInfo} tenantInfo - Public metadata about the tenant (e.g., clientId).
 * @returns Promise<void>
 * @throws If credentials are missing or renewal fails.
 */
export async function renewClientToken(
  authInfo: TenantAuth,
  tenantInfo: TenantInfo
): Promise<void> {
  const result = await clientCredentialsFlow({
    clientId: tenantInfo.clientId,
    clientSecret: authInfo.clientSecret,
    organizationId: tenantInfo.organizationId,
    tenantId: tenantInfo.tenantId,
    audience: tenantInfo.audience,
    authority: tenantInfo.authority,
    baseUrl: tenantInfo.baseUrl,
  });
  const tenantId = tenantInfo.tenantId;

  await writeTenantAuthInfo(tenantId, {
    clientSecret: authInfo.clientSecret,
    access_token: result.data.access_token,
    expires_in: result.data.expires_in,
    expires_at: new Date(Date.now() + result.data.expires_in * 1000).toISOString(),
  });

  console.info(`\n Token for tenant ${tenantId} renewed.`);
}

/**
 * Ensures a valid token exists, renews it if expired.
 * Returns tenant context if successful, otherwise null.
 */
export async function validateAndRenewAuthIfExpired(): Promise<{ tenantId: string } | null> {
  const tenantId = getActiveTenant();
  if (!tenantId) return null;

  const authInfo = await readTenantAuthInfo(tenantId);
  if (!authInfo) return null;

  const isValid = validateAuthInfo(authInfo);
  if (isValid) {
    return { tenantId };
  }
  const tenantInfo = await readTenantInfo(tenantId);
  if (!tenantInfo) return null;

  console.info(`\n Token for tenant ${tenantId} is expired. Renewing...`);

  try {
    if (authInfo.clientSecret) {
      await renewClientToken(authInfo, tenantInfo);
    } else {
      // <TODO>: Implement Device auth token renewal.
      throw new Error('\n Please use clientSecret for authentication.');
    }
    return { tenantId };
  } catch (err) {
    console.error(`\n Failed to renew token for tenant '${tenantId}'`);

    console.warn(`\n Cleaning up stale authentication data for tenant '${tenantId}'...`);
    await deleteTenantAuthInfo(tenantId);
    await deleteKey(tenantId);
    clearActiveTenant();

    return null;
  }
}
