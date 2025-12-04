/**
 * Converts headers from various formats into a uniform key-value pair object.
 * @param incomingHeaders - Incoming headers in various formats such as Headers object or plain object.
 * @returns A record object containing headers as key-value pairs.
 */
export function normalizeHeaders(incomingHeaders: HeadersInit = {}) {
  const headers: Record<string, string | string[]> = {};

  if (typeof incomingHeaders.forEach === 'function')
    incomingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  else
    Object.entries(incomingHeaders).forEach(([key, value]) => {
      headers[key] = value;
    });

  return headers;
}
