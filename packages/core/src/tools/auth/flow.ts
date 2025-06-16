/* eslint-disable jsdoc/require-jsdoc */
import {
  DeviceAuthRequest,
  DeviceAuthResponse,
  DeviceTokenPollRequest,
  TenantArgs,
} from './models';
import { decodeJwtPayload } from './tenant-store';
import {
  DEFAULT_SITECORE_AUTH_DOMAIN,
  DEFAULT_SITECORE_AUTH_AUDIENCE,
  DEFAULT_SITECORE_AUTH_BASE_URL,
  DEVICE_GRANT_TYPE,
  CLIENT_GRANT_TYPE,
  SCOPE,
  TIMEOUT,
  DEFAULT_INTERVAL,
} from '../../constants';

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

/**
 * Initiates the OAuth 2.0 Device Authorization flow by requesting a device and user code.
 * This flow is typically used by devices or CLI apps that cannot input credentials directly.
 * @param {DeviceAuthRequest} params - Parameters including clientId, audience, authority, and baseUrl.
 * @returns {Promise<DeviceAuthResponse>} A promise resolving to device authorization metadata needed for polling.
 * @throws {Error} If the device authorization request fails or returns an error response.
 */
export let startDeviceAuthFlow = _startDeviceAuthFlow;

/**
 * Polls the OAuth 2.0 device token endpoint to retrieve the access token once the user has authorized the device.
 * This is typically used to continue the device authorization process after a user enters a code on a browser.
 * @param {DeviceTokenPollRequest} params - Parameters for polling including clientId, deviceCode, interval, and authority.
 * @returns {Promise<any>} A promise resolving to the device token response including access token and refresh token.
 * @throws {Error} If polling fails or exceeds the timeout period.
 */
export let pollForDeviceToken = _pollForDeviceToken;

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
  set startDeviceAuthFlow(mockImplementation) {
    startDeviceAuthFlow = mockImplementation;
  },
  get startDeviceAuthFlow() {
    return _startDeviceAuthFlow;
  },
  set pollForDeviceToken(mockImplementation) {
    pollForDeviceToken = mockImplementation;
  },
  get pollForDeviceToken() {
    return _pollForDeviceToken;
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
    grant_type: CLIENT_GRANT_TYPE,
    baseUrl: baseUrl ?? '',
  });

  const response = await fetch(`${authority}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Error during client credentials flow');
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
    throw new Error('\n Mismatch: Provided organization ID does not match claims organization ID.');
  }

  return { data, tokenOrgId, tokenTenantId, tokenTenantName, accessToken: data.access_token };
}

export async function _startDeviceAuthFlow({
  clientId,
  audience,
  authority,
  baseUrl,
}: DeviceAuthRequest): Promise<DeviceAuthResponse> {
  const params = new URLSearchParams({
    client_id: clientId,
    scope: SCOPE,
    audience,
    baseUrl,
  });

  const response = await fetch(`${authority}/oauth/device/code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(
      responseBody.error_description ||
        responseBody.error ||
        'Error during device authorization flow'
    );
  }

  const {
    device_code: deviceCode,
    user_code: userCode,
    verification_uri: verificationUri,
    verification_uri_complete: verificationUriComplete,
    expires_in: expiresIn,
    interval,
  } = responseBody;

  return {
    deviceCode,
    userCode,
    verificationUri,
    verificationUriComplete,
    expiresIn,
    interval,
  };
}

export async function _pollForDeviceToken({
  clientId,
  deviceCode,
  interval = DEFAULT_INTERVAL,
  authority = DEFAULT_SITECORE_AUTH_DOMAIN,
}: DeviceTokenPollRequest) {
  const startTime = Date.now();

  while (Date.now() - startTime < TIMEOUT * 1000) {
    const params = new URLSearchParams({
      grant_type: DEVICE_GRANT_TYPE,
      device_code: deviceCode,
      client_id: clientId,
    });

    const response = await fetch(`${authority}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const responseBody = await response.json();

    if (response.ok) {
      return responseBody;
    }

    switch (responseBody.error) {
      case 'authorization_pending':
        console.log('\n ⌛ Waiting for user authorization...');
        break;

      case 'slow_down':
        console.log('🐢 Slowing down polling interval...');
        interval += 5;
        break;

      default:
        throw new Error(
          responseBody.error_description ||
            responseBody.error ||
            'Unknown error during device token polling.'
        );
    }

    await new Promise((resolve) => setTimeout(resolve, interval * 1000));
  }

  throw new Error('⏳ Timeout: User did not complete authorization in time.');
}
