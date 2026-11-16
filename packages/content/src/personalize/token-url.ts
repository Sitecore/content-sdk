// Characters that never appear unencoded in a URL value: control characters, whitespace,
// backslashes (browsers treat `\` like `/`) and HTML-significant characters.
// eslint-disable-next-line no-control-regex
const UNSAFE_URL_CHARS = /[\u0000-\u0020\u007F<>"'`\\]/;
// Browsers ignore whitespace and control characters inside a URL scheme (for example `java\tscript:`).
// eslint-disable-next-line no-control-regex
const IGNORED_IN_SCHEME = /[\u0000-\u0020]/g;
const SCHEME = /^([a-z][a-z\d+.-]*):/i;
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const URL_BASE = 'https://sitecore.invalid';
// Link and Image field properties that hold a URL.
const URL_KEYS = new Set(['href', 'src', 'url']);
// Link field properties that are appended to the href as its query string and fragment.
const URL_PART_KEYS = new Set(['querystring', 'anchor']);
// A whole string that is a URL (absolute, protocol-relative, root-relative, mailto: or tel:).
const URL_LIKE = /^(?:(?:https?:)?\/\/|\/|mailto:|tel:)[^\s<>"'`]*$/i;
// The head of a URL, which decides where it points: the scheme and host, or everything before the first `/`, `?` or `#`.
const URL_HEAD = /^\s*(?:[a-z][a-z\d+.-]*:)?(?:\/\/[^/?#]*)?[^/?#]*/i;

/**
 * True when a string must be treated as a URL: it is the value of a URL property
 * (`href`, `src`, `url`, `querystring`, `anchor`) or the whole authored string looks like a URL.
 * @param {string | undefined} key Own property name of the string
 * @param {string} maskedValue Authored string with token expressions replaced by placeholder text
 * @returns {boolean} Whether URL rules apply
 * @internal
 */
export function isUrlContext(key: string | undefined, maskedValue: string): boolean {
  return (
    (key !== undefined && (URL_KEYS.has(key) || URL_PART_KEYS.has(key))) ||
    URL_LIKE.test(maskedValue.trim())
  );
}

/**
 * Length of the URL head (scheme and host, or everything before the first `/`, `?` or `#`), where
 * token values are not allowed because they could change where the URL points. Query string and
 * anchor properties have no head.
 * @param {string | undefined} key Own property name of the string
 * @param {string} maskedValue Authored string with token expressions replaced by placeholders
 * @returns {number} Head length
 * @internal
 */
export function getUrlHeadLength(key: string | undefined, maskedValue: string): number {
  if (key !== undefined && URL_PART_KEYS.has(key)) {
    return 0;
  }
  return (URL_HEAD.exec(maskedValue) as RegExpExecArray)[0].length;
}

/**
 * True when the authored URL has no scheme, or an http, https, mailto or tel scheme. Values are never
 * inserted into other URLs (for example authored `javascript:` links).
 * @param {string} maskedValue Authored string with token expressions replaced by placeholders
 * @returns {boolean} Whether the authored scheme allows values
 * @internal
 */
export function hasAllowedScheme(maskedValue: string): boolean {
  const scheme = SCHEME.exec(maskedValue.replace(IGNORED_IN_SCHEME, ''));
  return !scheme || ALLOWED_PROTOCOLS.has(`${scheme[1].toLowerCase()}:`);
}

/**
 * True when a whole URL value is safe to render: an http, https, mailto, tel or relative URL with no
 * whitespace, control characters, backslashes or HTML-significant characters.
 * @param {string} value Candidate URL
 * @returns {boolean} Whether the URL is safe
 * @internal
 */
export function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || UNSAFE_URL_CHARS.test(trimmed)) {
    return false;
  }
  try {
    return ALLOWED_PROTOCOLS.has(new URL(trimmed, URL_BASE).protocol);
  } catch {
    return false;
  }
}
