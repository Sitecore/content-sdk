/**
 * Value written to debug output in place of a sensitive header value.
 * @internal
 */
export const REDACTED_HEADER_VALUE = '[redacted]';

/**
 * Lower-cased names of headers whose values must never be written to debug output.
 * `x-sitecore-editing-secret` carries the validated editing secret from the editing render
 * handler to the internal page request, so every proxy and fetcher that logs request headers sees it.
 */
const SENSITIVE_HEADER_NAMES = new Set(['x-sitecore-editing-secret']);

/**
 * Returns a copy of the headers with the values of sensitive headers (e.g. the editing secret)
 * replaced by {@link REDACTED_HEADER_VALUE}, so request details can be logged without leaking them.
 * Header names are matched case-insensitively. The input object is not modified.
 * @param {Record<string, string | string[]>} headers - Headers as key/value pairs.
 * @returns {Record<string, string | string[]>} Copy of the headers that is safe to log.
 * @internal
 */
export const redactSensitiveHeaders = (
  headers: Record<string, string | string[]>
): Record<string, string | string[]> => {
  const safeHeaders: Record<string, string | string[]> = {};

  Object.keys(headers).forEach((name) => {
    safeHeaders[name] = SENSITIVE_HEADER_NAMES.has(name.toLowerCase())
      ? REDACTED_HEADER_VALUE
      : headers[name];
  });

  return safeHeaders;
};
