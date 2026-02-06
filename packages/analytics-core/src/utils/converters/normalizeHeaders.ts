/**
 * Converts headers from various formats into a uniform key-value pair object.
 * @param {HeadersInit} incomingHeaders Incoming headers such as a Headers instance or plain object.
 * @returns {Record<string, string | string[]>} Normalized headers as key-value pairs.
 * @internal
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
