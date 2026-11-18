/**
 * Matches the javascript: URLs React blocks in hrefs.
 * Case-insensitive, allows leading spaces and control characters, and allows
 * tab or newline characters between the letters of the scheme.
 */
const JAVASCRIPT_URL_PATTERN =
  // eslint-disable-next-line no-control-regex
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;

const URL_ATTRIBUTE_PATTERN =
  /(\s)(href|src|action|formaction|poster|cite|background|xlink:href)(\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

const NAMED_ENTITIES: Record<string, string> = {
  colon: ':',
  tab: '\t',
  newline: '\n',
  nbsp: ' ',
};

const reportedJavascriptUrls = new Set<string>();

/**
 * Whether a decoded URL uses the javascript protocol.
 * @param {string} url candidate URL
 * @returns {boolean} true when the URL is a javascript: URL
 */
function isJavascriptUrl(url: string): boolean {
  return JAVASCRIPT_URL_PATTERN.test(url);
}

/**
 * Decodes character references that can hide a javascript: scheme.
 * @param {string} value attribute value
 * @returns {string} decoded value
 */
function decodeHtmlAttribute(value: string): string {
  let current = value;

  for (let pass = 0; pass < 3; pass++) {
    const decoded = current.replace(/&(#x?[0-9a-f]+|[a-z]+);?/gi, (entity, body: string) => {
      if (body[0] === '#') {
        const codePoint =
          body[1] === 'x' || body[1] === 'X'
            ? parseInt(body.slice(2), 16)
            : parseInt(body.slice(1), 10);

        if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
          return entity;
        }

        return String.fromCodePoint(codePoint);
      }

      return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
    });

    if (decoded === current) {
      break;
    }

    current = decoded;
  }

  return current;
}

/**
 * Logs a blocked javascript: URL once for each distinct value.
 * @param {string} url the blocked URL
 */
function reportBlockedJavascriptUrl(url: string): void {
  if (reportedJavascriptUrls.has(url)) {
    return;
  }

  reportedJavascriptUrls.add(url);
  console.error(
    `A javascript: URL in rich text or text HTML was removed ("${url}"). The link text is left in place without the URL.`
  );
}

/**
 * Removes javascript: URLs from URL-bearing attributes in an HTML string.
 * The surrounding markup and text are preserved. The input is not modified.
 * @param {string} html HTML from a RichText or unencoded Text field
 * @returns {string} HTML with those attributes removed
 */
export function omitJavascriptUrls(html: string): string {
  if (!html) {
    return html;
  }

  return html.replace(
    URL_ATTRIBUTE_PATTERN,
    (match, _space, _name, _equals, doubleQuoted, singleQuoted, unquoted) => {
      const rawValue = doubleQuoted ?? singleQuoted ?? unquoted ?? '';
      const decodedValue = decodeHtmlAttribute(rawValue);

      if (!isJavascriptUrl(decodedValue)) {
        return match;
      }

      reportBlockedJavascriptUrl(decodedValue);
      return '';
    }
  );
}

/**
 * Clears the once-per-URL log. Used by tests.
 */
export function resetOmittedJavascriptUrlLog(): void {
  reportedJavascriptUrls.clear();
}
