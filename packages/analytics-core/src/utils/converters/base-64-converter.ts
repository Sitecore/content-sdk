/**
 * Converts a string or plain object to a base64 string representation.
 * @param {string | Record<string, unknown>} input The value to convert.
 * @returns {string} The base64-encoded string.
 */
export function convertToBase64(input: string | { [key: string]: unknown }): string {
  const data = typeof input === 'string' ? input : JSON.stringify(input);

  const stringFormat = 'base64';
  if (typeof Buffer === 'function') return Buffer.from(data).toString(stringFormat);

  if (typeof window?.btoa === 'function') return window.btoa(data);

  return data;
}
