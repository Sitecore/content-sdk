import { getActiveTenant, clearActiveTenant } from './tenant-state';
import { clientCredentialsFlow } from './flow';
import { TenantAuth } from './../../scripts/auth/models';
import { writeTenantAuthInfo, readTenantAuthInfo, deleteTenantAuthInfo } from './tenant-store';

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
 * @param {string} tenantId - ID of the tenant whose token needs renewal.
 * @param {TenantAuth} auth
 * @returns Promise<void>
 * @throws If credentials are missing or renewal fails.
 */
export async function renewClientToken(tenantId: string, auth: TenantAuth): Promise<void> {
  const result = await clientCredentialsFlow({
    clientId: auth.clientId,
    clientSecret: auth.clientSecret,
  });

  await writeTenantAuthInfo(tenantId, {
    clientId: auth.clientId,
    clientSecret: auth.clientSecret,
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
export async function renewAuthIfExpired(): Promise<{ tenantId: string } | null> {
  const tenantId = getActiveTenant();
  if (!tenantId) return null;

  const auth = await readTenantAuthInfo(tenantId);
  if (!auth) return null;

  const isValid = validateAuthInfo(auth);
  if (isValid) {
    return { tenantId };
  }

  console.info(`\n Token for tenant ${tenantId} is expired. Renewing...`);

  try {
    if (auth.clientSecret) {
      await renewClientToken(tenantId, auth);
    } else {
      // <TODO>: Implement Device auth token renewal.
      throw new Error('\n Please use clientSecret for authentication.');
    }
    return { tenantId };
  } catch (err) {
    console.error(`\n Token renewal failed: ${(err as Error).message}`);
    await deleteTenantAuthInfo(tenantId);
    clearActiveTenant();
    return null;
  }
}
