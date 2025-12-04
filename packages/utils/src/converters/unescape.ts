/* eslint-disable @typescript-eslint/naming-convention */
const htmlUnescape: Record<string, string> = {
  '&#39;': "'",
  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '&quot;': '"',
} as const;
/* eslint-enable @typescript-eslint/naming-convention */

/** Used to match HTML entities and HTML characters. */
const reEscapedHtml = /&(?:amp|lt|gt|quot|#(0+)?39);/g;
const reHasEscapedHtml = new RegExp(reEscapedHtml.source);

/**
 * Converts the HTML entities `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
 * their corresponding characters.
 *
 * @param string - The string to unescape.
 * @returns Returns the unescaped string.
 * @see escape, escapeRegExp
 */
export function unescape(string = '') {
  return reHasEscapedHtml.test(string)
    ? string.replace(reEscapedHtml, (entity) => htmlUnescape[entity] || "'")
    : string;
}
