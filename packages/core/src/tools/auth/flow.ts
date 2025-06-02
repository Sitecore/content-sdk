/* eslint-disable jsdoc/require-jsdoc */
import { TenantArgs } from './models';
import { decodeJwtPayload } from './tenant-store';
import {
  DEFAULT_SITECORE_AUTH_DOMAIN,
  DEFAULT_SITECORE_AUTH_AUDIENCE,
  DEFAULT_SITECORE_AUTH_BASE_URL,
} from '../../constants';

const GRANT_TYPE = 'client_credentials';

/**
 * Performs the OAuth 2.0 client credentials flow to obtain a JWT access token
 * from the Sitecore Identity Provider using the provided client credentials.
 * @param {object} [args] - The arguments for client credentials flow
 * @param {string} [args.clientId] - The client ID registered with Sitecore Identity
 * @param {string} [args.clientSecret] - The client secret associated with the client ID
 * @param {string} [args.organizationId] - The ID of the organization the client belongs to
 * @param {string} [args.tenantId] - The tenant ID representing the specific Sitecore environment
 * @param {string} [args.audience] - The API audience the token is intended for. Defaults to `constants.DEFAULT_SITECORE_AUTH_AUDIENCE`
 * @param {string} [args.authority] - The auth server base URL. Defaults to `constants.DEFAULT_SITECORE_AUTH_DOMAIN`
 * @param {string} [args.baseUrl] - The base URL for the API, used to construct the audience. Defaults to `constants.DEFAULT_SITECORE_AUTH_BASE_URL`
 * @returns A Promise that resolves to the access token response (including access token, token type, expiry, etc.)
 * @throws Will log and exit the process if the request fails or returns a non-OK status
 */
export let clientCredentialsFlow = _clientCredentialsFlow;

// mock setup for unit tests to make sinon happy and mock-able with esbuild/tsx
// https://sinonjs.org/how-to/typescript-swc/
// This, plus the `_` names make the exports writable for sinon
export const unitMocks = {
  set clientCredentialsFlow(mockImplementation) {
    clientCredentialsFlow = mockImplementation;
  },
  get clientCredentialsFlow() {
    return _clientCredentialsFlow;
  },
};

async function _clientCredentialsFlow({
  clientId,
  clientSecret,
  organizationId,
  tenantId,
  audience = DEFAULT_SITECORE_AUTH_AUDIENCE,
  authority = DEFAULT_SITECORE_AUTH_DOMAIN,
  baseUrl = DEFAULT_SITECORE_AUTH_BASE_URL,
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

    return { data, tokenOrgId, tokenTenantId, tokenTenantName, accessToken: data.access_token };
  } catch (error) {
    console.error(
      '\n Error during client credentials flow:',
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}
