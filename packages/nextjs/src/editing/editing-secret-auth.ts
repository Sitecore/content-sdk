import { secretsEqual } from '@sitecore-content-sdk/core/node-tools';
import { getEditingSecret } from '../utils/utils';
import { EDITING_SECRET_HEADER } from './constants';

/**
 * Reads Next.js request headers when available (App Router / server actions).
 * Returns null when `headers()` is unavailable so Pages Router callers can continue.
 * @returns {Promise<Headers | null>} The request headers, or null.
 * @internal
 */
export const getEditingRequestHeaders = async (): Promise<Headers | null> => {
  try {
    const { headers } = await import('next/headers');
    return await headers();
  } catch {
    return null;
  }
};

/**
 * Authorizes an editing/Design Library request from the internal secret header.
 * Fail-closed: missing headers, empty env, placeholder, or mismatch → false.
 * Uses a constant-time comparison to prevent timing attacks.
 * @returns {Promise<boolean>} True when the request carries a valid editing secret.
 * @internal
 */
export const isDesignLibraryAuthorizedFromHeaders = async (): Promise<boolean> => {
  const headerList = await getEditingRequestHeaders();
  const envSecret = getEditingSecret();
  return secretsEqual(headerList?.get(EDITING_SECRET_HEADER), envSecret);
};
