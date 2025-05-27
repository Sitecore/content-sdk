import { TenantArgs } from '../../scripts/auth/models';
import { decodeJwtPayload } from './tenant-store';

export const AUTH0_DOMAIN = 'https://auth.sitecorecloud.io';
export const AUDIENCE = 'https://api.sitecorecloud.io';
export const BASE_URL = 'https://edge-platform.sitecorecloud.io/cs/api';
const GRANT_TYPE = 'client_credentials';

/**
 * Performs the OAuth 2.0 client credentials flow to obtain a JWT access token
 * from the Sitecore Identity Provider using the provided client credentials.
 * @param {object} args - The arguments for client credentials flow
 * @param {string} args.clientId - The client ID registered with Sitecore Identity
 * @param {string} args.clientSecret - The client secret associated with the client ID
 * @param {string} args.organizationId - The ID of the organization the client belongs to
 * @param {string} args.tenantId - The tenant ID representing the specific Sitecore environment
 * @param {string} [args.audience] - The API audience the token is intended for. Defaults to `AUDIENCE`
 * @param {string} [args.authority] - The auth server base URL. Defaults to `AUTH0_DOMAIN`
 * @param {string} [args.baseUrl] - The base URL for the API, used to construct the audience
 * @returns A Promise that resolves to the access token response (including access token, token type, expiry, etc.)
 * @throws Will log and exit the process if the request fails or returns a non-OK status
 */
export async function clientCredentialsFlow({
  clientId,
  clientSecret,
  organizationId,
  tenantId,
  audience = AUDIENCE,
  authority = AUTH0_DOMAIN,
  baseUrl = BASE_URL,
}: TenantArgs) {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret ?? '',
    organization_id: organizationId ?? '',
    tenant_id: tenantId ?? '',
    audience,
    grant_type: GRANT_TYPE,
    baseUrl: baseUrl ?? '',
  });

  try {
    const response = await fetch(`${authority}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error_description || data.error || 'Error during client credentials flow'
      );
    }

    const decodedPayload = decodeJwtPayload(data.access_token) || {};

    if (!decodedPayload?.tokenTenantId || !decodedPayload.tokenOrgId) {
      throw new Error('\n Token is missing required claims tenant_id or org_id.');
    }

    const { tokenTenantId, tokenOrgId, tokenTenantName } = decodedPayload;

    if (tenantId && tenantId !== tokenTenantId) {
      throw new Error('\n Mismatch: Provided tenant ID does not match claims tenant ID.');
    }

    if (organizationId && organizationId !== tokenOrgId) {
      throw new Error(
        '\n Mismatch: Provided organization ID does not match claims organization ID.'
      );
    }

    return { data, tokenOrgId, tokenTenantId, tokenTenantName };
  } catch (error) {
    console.error(
      '\n Error during client credentials flow:',
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}
