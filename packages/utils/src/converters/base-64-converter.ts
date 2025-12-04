/*
 * A function that converts a string or an object to a base64 string
 * @param input - The string or object to be converted
 * @returns A base64 string
 */
export function convertToBase64(input: string | { [key: string]: unknown }): string {
  const data = typeof input === 'string' ? input : JSON.stringify(input);

  const stringFormat = 'base64';
  if (typeof Buffer === 'function') return Buffer.from(data).toString(stringFormat);

  if (typeof globalThis?.window?.btoa === 'function') return globalThis.window.btoa(data);

  return data;
}
