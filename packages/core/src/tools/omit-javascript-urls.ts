import { isJavascriptUrl } from './utils';

const URL_ATTRIBUTE_PATTERN =
  /(\s)(href|src|action|formaction|poster|cite|background|xlink:href)(\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

const NAMED_ENTITIES: Record<string, string> = {
  colon: ':',
  tab: '\t',
  newline: '\n',
  nbsp: ' ',
};

/**
 * Result of removing javascript: URLs from an HTML string.
 * @internal
 */
export type OmitJavascriptUrlsResult = {
  /** HTML with the javascript: URL attributes removed. */
  html: string;
  /** The decoded URLs that were removed, in document order. */
  omittedUrls: string[];
};

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
 * Removes javascript: URLs from URL-bearing attributes in an HTML string.
 * The surrounding markup and text are preserved. The input is not modified.
 * Logging is left to the caller.
 * @param {string} html HTML from a rich text or unencoded text field
 * @returns {OmitJavascriptUrlsResult} the cleaned HTML and the URLs that were removed
 * @internal
 */
export function omitJavascriptUrls(html: string): OmitJavascriptUrlsResult {
  const omittedUrls: string[] = [];

  if (!html) {
    return { html, omittedUrls };
  }

  const cleaned = html.replace(
    URL_ATTRIBUTE_PATTERN,
    (match, _space, _name, _equals, doubleQuoted, singleQuoted, unquoted) => {
      const decodedValue = decodeHtmlAttribute(doubleQuoted ?? singleQuoted ?? unquoted ?? '');

      if (!isJavascriptUrl(decodedValue)) {
        return match;
      }

      omittedUrls.push(decodedValue);
      return '';
    }
  );

  return { html: cleaned, omittedUrls };
}

/**
 * Builds the console message for a javascript: URL removed from field HTML.
 * @param {string} url the removed URL
 * @returns {string} the message
 * @internal
 */
export function getOmittedJavascriptUrlMessage(url: string): string {
  return `A javascript: URL in rich text or text HTML was removed ("${url}"). The link text is left in place without the URL.`;
}
