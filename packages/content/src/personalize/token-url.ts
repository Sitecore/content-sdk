const URL_BASE = 'https://sitecore.invalid';
// Detecting control characters is the purpose of this pattern.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const SRCSET_DESCRIPTOR = /^(?:\d+\.\d+|\d+)[wx]$/;

/**
 * Own-property keys that receive URL validation after token replacement.
 * @internal
 */
export const TOKEN_URL_KEYS = new Set(['href', 'src', 'url', 'srcSet', 'srcset']);

/**
 * Validates a single tokenized URL value.
 * Rejects control characters, backslashes, javascript/data/vbscript, and
 * unknown schemes. Allowed: http, https, mailto, tel, relative paths,
 * query-only values, fragment-only values, and Sitecore media paths.
 * @param {string} value Candidate URL
 * @returns {string} The original value when valid, otherwise `""`
 * @internal
 */
export function validateTokenizedUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  if (CONTROL_CHARS.test(trimmed) || trimmed.includes('\\')) {
    return '';
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed, URL_BASE);
  } catch {
    return '';
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return '';
  }

  return value;
}

/**
 * Validates a srcSet value. Every comma-separated candidate must be
 * `<valid-url> [<positive-number>w | <positive-number>x]`.
 * If any candidate is invalid, the complete srcSet is rejected.
 * @param {string} value Candidate srcSet
 * @returns {string} The original value when valid, otherwise `""`
 * @internal
 */
export function validateTokenizedSrcSet(value: string): string {
  const candidates = value.split(',');
  for (const candidate of candidates) {
    const parts = candidate.trim().split(/\s+/);
    if (parts.length === 0 || parts[0] === '') {
      return '';
    }
    if (parts.length > 2) {
      return '';
    }
    if (validateTokenizedUrl(parts[0]) === '') {
      return '';
    }
    if (parts.length === 2) {
      if (!SRCSET_DESCRIPTOR.test(parts[1]) || Number.parseFloat(parts[1]) <= 0) {
        return '';
      }
    }
  }
  return value;
}

/**
 * Validates a tokenized string for a URL-sensitive own property key.
 * @param {string} key Own property key
 * @param {string} value Tokenized value
 * @returns {string} Validated value, or `""` when rejected
 * @internal
 */
export function validateTokenizedUrlProperty(key: string, value: string): string {
  if (key === 'srcSet' || key === 'srcset') {
    return validateTokenizedSrcSet(value);
  }
  return validateTokenizedUrl(value);
}
