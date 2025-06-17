import { getActiveTenant, clearActiveTenant } from './tenant-state';
import { clientCredentialsFlow } from './flow';
import {
  RefreshAccessTokenResponse,
  RefreshTokenRequest,
  TenantAuthInfo,
  TenantInfo,
  TokenResponse,
} from './models';
import {
  writeTenantAuthInfo,
  readTenantAuthInfo,
  deleteTenantAuthInfo,
  readTenantInfo,
} from './tenant-store';
import { deleteKey } from './encryption';
import { DEFAULT_SITECORE_AUTH_DOMAIN, REFRESH_GRANT_TYPE } from './../../constants';
import { decodeJwtPayload } from './tenant-store';
import { sendPostRequest } from './fetcher';

/**
 * Requests a new access token using the OAuth 2.0 refresh token grant type.
 * This is used to "upgrade" an initial device flow token by including tenant-specific context.
 * @param {RefreshTokenRequest} options - Configuration for the refresh token request.
 * @returns {Promise<any>} A promise that resolves to the refreshed token data including tenant context.
 * @throws {Error} If the token request fails or returns an error response.
 */
export let getRefreshAccessToken = _getRefreshAccessToken;

export const unitMocks = {
  get getRefreshAccessToken() {
    return _getRefreshAccessToken;
  },
  set getRefreshAccessToken(mockFn) {
    getRefreshAccessToken = mockFn;
  },
};

/**
 * Validates whether a given auth config is still valid (i.e., not expired).
 * @param {TenantAuth} authInfo - The tenant auth configuration.
 * @returns True if the token is still valid, false if expired.
 */
export function validateAuthInfo(authInfo: TenantAuthInfo): boolean {
  const now = new Date();
  const expiry = new Date(authInfo.expires_at);
  return now < expiry;
}

/**
 * Renews the token for a given tenant using stored credentials.
 * @param {TenantAuth} authInfo - Current authentication info for the tenant.
 * @param {TenantInfo} tenantInfo - Public metadata about the tenant (e.g., clientId).
 * @returns {Promise<void>} resolving when the token is successfully renewed.
 * @throws If credentials are missing or renewal fails.
 */
export async function renewClientToken(
  authInfo: TenantAuthInfo,
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

  console.log(`\n Token for tenant ${tenantId} renewed.`);
}

/**
 * Ensures a valid token exists, renews it if expired.
 * @returns {Promise<{ tenantId: string } | null>} returns tenant context if successful, otherwise null.
 * @throws If renewal fails or credentials are missing.
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

  console.log(`\n Token for tenant ${tenantId} is expired. Renewing...`);

  try {
    if (authInfo.clientSecret) {
      await renewClientToken(authInfo, tenantInfo);
      return { tenantId };
    } else if (authInfo.refresh_token) {
      const refreshTokenResponse = await getRefreshAccessToken({
        clientId: tenantInfo.clientId,
        refreshToken: authInfo.refresh_token,
        tenantId: tenantId,
        organizationId: tenantInfo.organizationId,
        authority: tenantInfo.authority,
      });

      await writeTenantAuthInfo(tenantId, {
        expires_at: new Date(Date.now() + refreshTokenResponse.expires_in * 1000).toISOString(),
        ...refreshTokenResponse,
      });

      console.log(`\n Token for tenant ${tenantId} renewed.`);

      return { tenantId };
    } else {
      throw new Error('\n No valid credentials found for token renewal.');
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error(`\n Failed to renew token for tenant '${tenantId}: ${errorMessage}'`);

    console.log(`\n Cleaning up stale authentication data for tenant '${tenantId}'...`);
    await deleteTenantAuthInfo(tenantId);
    await deleteKey(tenantId);
    clearActiveTenant();

    return null;
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
async function _getRefreshAccessToken({
  clientId,
  refreshToken,
  tenantId,
  organizationId,
  authority = DEFAULT_SITECORE_AUTH_DOMAIN,
}: RefreshTokenRequest): Promise<RefreshAccessTokenResponse> {
  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: REFRESH_GRANT_TYPE,
    refresh_token: refreshToken,
    tenant_id: tenantId,
    organization_id: organizationId,
  });

  const url = `${authority}/oauth/token`;
  const data = await sendPostRequest<TokenResponse>(url, params);

  const { tokenTenantName } = decodeJwtPayload(data.access_token) || {};

  return { ...data, tenantName: tokenTenantName };
}
