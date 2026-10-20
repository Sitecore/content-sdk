// Detecting control characters is the purpose of this pattern.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const URL_BASE = 'https://sitecore.invalid';
const SRCSET_DESCRIPTOR = /^\d+(?:\.\d+)?[wx]$/;
const URL_KEYS = new Set(['href', 'src', 'url', 'srcSet', 'srcset']);
// A whole string that is a URL (absolute, protocol-relative, root-relative, mailto: or tel:).
const URL_LIKE = /^(?:(?:https?:)?\/\/|\/|mailto:|tel:)[^\s<>"'`]*$/i;

/**
 * True when a string must be treated as a URL: it is the value of a URL property
 * (`href`, `src`, `url`, `srcSet`) or the whole authored string looks like a URL.
 * @param {string | undefined} key Own property name of the string
 * @param {string} maskedValue Authored string with token expressions replaced by a placeholder character
 * @returns {boolean} Whether URL rules apply
 * @internal
 */
export function isUrlContext(key: string | undefined, maskedValue: string): boolean {
  return (key !== undefined && URL_KEYS.has(key)) || URL_LIKE.test(maskedValue.trim());
}

/**
 * True when a URL (or `srcSet` when `key` is `srcSet`/`srcset`) is safe to render: no control
 * characters or backslashes, and only http, https, mailto, tel or relative URLs.
 * @param {string | undefined} key Own property name of the string
 * @param {string} value Candidate URL
 * @returns {boolean} Whether the value is safe
 * @internal
 */
export function isSafeUrlValue(key: string | undefined, value: string): boolean {
  if (key === 'srcSet' || key === 'srcset') {
    return value.split(',').every((candidate) => {
      const parts = candidate.trim().split(/\s+/);
      if (parts.length > 2 || !isSafeUrl(parts[0])) {
        return false;
      }
      return parts.length === 1 || (SRCSET_DESCRIPTOR.test(parts[1]) && parseFloat(parts[1]) > 0);
    });
  }
  return isSafeUrl(value);
}

/**
 * True when a single URL has no control characters or backslashes and uses an allowed scheme
 * (or is relative). An empty value is safe.
 * @param {string} value Candidate URL
 * @returns {boolean} Whether the URL is safe
 */
function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }
  if (CONTROL_CHARS.test(trimmed) || trimmed.includes('\\')) {
    return false;
  }
  try {
    return ALLOWED_PROTOCOLS.has(new URL(trimmed, URL_BASE).protocol);
  } catch {
    return false;
  }
}
