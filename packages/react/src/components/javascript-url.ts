/**
 * Matches the javascript: URLs React blocks in hrefs.
 * Case-insensitive, allows leading spaces and control characters, and allows
 * tab or newline characters between the letters of the scheme.
 * @see https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/shared/sanitizeURL.js
 */
// Control characters are intentional: this matches the javascript: URLs React blocks.
const JAVASCRIPT_URL_PATTERN =
  // eslint-disable-next-line no-control-regex
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;

const reportedJavascriptUrls = new Set<string>();

/**
 * Whether an href is a javascript: URL React would block.
 * Next.js Link keeps a copy of this check so the same URLs are not passed to next/link.
 * @param {string} url candidate href
 * @returns {boolean} true when the URL uses the javascript protocol
 * @internal
 */
export function isJavascriptUrl(url: string): boolean {
  return JAVASCRIPT_URL_PATTERN.test(url);
}

/**
 * Logs a blocked javascript: URL once for each distinct href.
 * @param {string} href the blocked URL
 * @internal
 */
export function reportBlockedJavascriptUrl(href: string): void {
  if (reportedJavascriptUrls.has(href)) {
    return;
  }

  reportedJavascriptUrls.add(href);
  console.error(
    `Link blocked a javascript: URL ("${href}"). The link text is rendered without an href.`
  );
}

/**
 * Clears the once-per-href log. Used by tests.
 * @internal
 */
export function resetBlockedJavascriptUrlLog(): void {
  reportedJavascriptUrls.clear();
}
