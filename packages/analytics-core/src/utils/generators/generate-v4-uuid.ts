/**
 * Generates a v4 UUID string using the global crypto API.
 * @returns {string} A v4 UUID string.
 * @internal
 */
export function generateV4UUID(): string {
  return globalThis.crypto.randomUUID();
}
