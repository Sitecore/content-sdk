/* eslint-disable jsdoc/require-jsdoc */

import { CLAIMS } from './../../constants';

/**
 * Decodes a JWT without verifying its signature.
 * @param {string} token - The access token string.
 * @returns Decoded payload object or null if invalid.
 */
export let decodeJwtPayload = _decodeJwtPayload;

// mock setup for unit tests to make sinon happy and mock-able with esbuild/tsx
// https://sinonjs.org/how-to/typescript-swc/
// This, plus the `_` names make the exports writable for sinon
export const unitMocks = {
  set decodeJwtPayload(mockImplementation) {
    decodeJwtPayload = mockImplementation;
  },
  get decodeJwtPayload() {
    return _decodeJwtPayload;
  },
};

function _decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
    const decoded = JSON.parse(payload);
    return {
      tokenTenantId: decoded?.[`${CLAIMS}/tenant_id`],
      tokenOrgId: decoded?.[`${CLAIMS}/org_id`],
      tokenTenantName: decoded?.[`${CLAIMS}/tenant_name`],
    };
  } catch (error) {
    console.error('\n Failed to decode access token:', (error as Error).message);
    return null;
  }
}
