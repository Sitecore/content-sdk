import { createHash, timingSafeEqual } from 'crypto';

/**
 * Compares two secrets in constant time to prevent timing attacks.
 * Both values are SHA-256 hashed first, so the compared buffers always have the same length
 * (`timingSafeEqual` throws on unequal lengths) and the secret length is not leaked.
 * Fails closed: returns false when either value is missing, empty or not a string
 * (e.g. a repeated query param parsed as an array).
 * @param {unknown} received - The secret received with the request.
 * @param {string | null} [expected] - The configured secret.
 * @returns {boolean} True when both secrets are non-empty and equal.
 * @internal
 */
export const secretsEqual = (received: unknown, expected?: string | null): boolean => {
  if (typeof received !== 'string' || !received || !expected) {
    return false;
  }

  const receivedHash = createHash('sha256').update(received).digest();
  const expectedHash = createHash('sha256').update(expected).digest();

  return timingSafeEqual(receivedHash, expectedHash);
};
