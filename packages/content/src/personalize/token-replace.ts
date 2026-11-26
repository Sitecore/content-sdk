import { getTokenValue, TOKEN_KEY_PATTERN, TokenMap } from './token-map';
import { getUrlHeadLength, hasAllowedScheme, isSafeUrl, isUrlContext } from './token-url';

const TOKEN_EXPRESSION = /\{\{([^{}]*)\}\}/g;
// Private-use characters mark token positions while the string is classified.
const MARK_OPEN = '\uE000';
const MARK_CLOSE = '\uE001';
const MARK = /\uE000(\d+)\uE001/g;
const WHOLE_MARK = /^\uE000(\d+)\uE001$/;
const MARKUP = /<[A-Za-z/!?]/;
// Browsers ignore whitespace and control characters inside a URL scheme (for example `java\tscript:`).
// eslint-disable-next-line no-control-regex
const IGNORED_IN_SCHEME = /[\u0000-\u0020]/g;
const DANGEROUS_SCHEME = /^(?:javascript|vbscript|data):/i;
// HTML whitespace.
const WS = '[\\t\\n\\f\\r ]';
// The rest of a start or end tag: whitespace-separated attributes whose values are quoted, unquoted
// (running to whitespace or `>`), or empty at the end of the tag. Browsers end a tag written this way at
// the same `>`.
const TAG_REST = `(?:${WS}+[^\\t\\n\\f\\r />"'<=]+(?:${WS}*=${WS}*(?:"[^"]*"|'[^']*'|[^\\t\\n\\f\\r >"'][^\\t\\n\\f\\r >]*|(?=${WS}*\\/?>)))?)*${WS}*\\/?>`;
// The next piece of markup: text (group 1), a comment (2), markup that browsers read as a comment
// ending at the next `>`, such as a doctype or `<?xml ...?>` (3), or a start or end tag (4 is `/` for end
// tags, 5 is the name). CDATA sections, unterminated comments and malformed tags do not match.
const HTML_PIECE = new RegExp(
  [
    '((?:[^<]+|<(?![A-Za-z/!?]))+)',
    '(<!--(?!-?>)[^-]*(?:-(?!-!?>)[^-]*)*-->)',
    '(<(?:!(?!--|\\[CDATA\\[)|\\?|\\/(?![A-Za-z]))[^>]*>)',
    `<(\\/?)([A-Za-z][^\\t\\n\\f\\r />]*)${TAG_REST}`,
  ].join('|'),
  'y'
);
// Elements whose content browsers do not parse as markup.
const RAW_TEXT = /^(?:script|style|textarea|title|xmp|iframe|noembed|noframes|noscript)$/i;
// Code samples, whose text keeps tokens as authored.
const CODE = /^(?:pre|code)$/i;
// Inside SVG, MathML and `<select>`, and in `<noscript>`, browsers may parse that content as markup.
const MARKUP_IN_RAW_TEXT = /<(?:svg|math|select)[\t\n\f\r />]/i;
const SCRIPT_START = /<script[\t\n\f\r />]/i;

type TokenExpression = { source: string; key: string; fallback?: string };

/**
 * Resolves dynamic content tokens (`{{key}}`, `{{key|fallback}}`) in an authored string.
 *
 * - Keys must match `[A-Za-z0-9_.-]+`; other `{{...}}` text (and `{{{...}}}`) is left as authored.
 * - A token with no value renders its fallback, or is removed when it has none.
 * - Plain strings get values as written, unless the result would contain markup or start with a
 * `javascript:`, `vbscript:` or `data:` scheme; then only fallbacks are used.
 * - Strings with markup get HTML-escaped values only where browsers parse text. Inside tags, directly
 * after `<`, and in markup this function does not fully recognize (for example malformed tags or
 * CDATA), only fallbacks are used. Tokens in comments, `<pre>`, `<code>` and elements whose content is
 * not markup (such as `<script>`, `<style>` and `<textarea>`) are kept as authored.
 * - URLs (`href`, `src`, `url`, `querystring`, `anchor` properties, or a string that is entirely a URL):
 * a string that is a single token takes a whole http(s), mailto, tel or relative URL value. Other values
 * are percent-encoded and only allowed after the first `/`, `?` or `#` that follows the scheme and host,
 * in http(s), mailto, tel or relative URLs. Before it (the host, a `mailto:` address, a `tel:` number or
 * the start of a relative URL) only fallbacks are used.
 *
 * Fallbacks are trusted authored content and are inserted as written.
 * @param {string} input Authored string
 * @param {TokenMap} tokens Token map
 * @param {string} [key] Own property name of the string, used to detect URL properties
 * @returns {string} Resolved string, or `input` when it has no tokens
 * @internal
 */
export function replaceTokens(input: string, tokens: TokenMap, key?: string): string {
  if (input.indexOf('{{') === -1 || input.indexOf(MARK_OPEN) !== -1) {
    return input;
  }

  const expressions: TokenExpression[] = [];
  const masked = input.replace(TOKEN_EXPRESSION, (source, body: string, offset: number) => {
    // `{{{key}}}` (for example Handlebars triple-stash) is not a token.
    if (input[offset - 1] === '{' || input[offset + source.length] === '}') {
      return source;
    }
    const expression = parseExpression(source, body);
    if (!expression) {
      return source;
    }
    expressions.push(expression);
    return `${MARK_OPEN}${expressions.length - 1}${MARK_CLOSE}`;
  });
  if (expressions.length === 0) {
    return input;
  }

  const value = (expression: TokenExpression) => getTokenValue(tokens, expression.key);
  const fallback = (expression: TokenExpression) => expression.fallback ?? '';

  // Classify with a placeholder and with the fallbacks in place, so `/p/{{city|new york}}` and
  // `{{url|/home}}` are both recognized as URLs. A string whose fallbacks add markup is not a URL.
  const withPlaceholders = resolveMarks(masked, () => 'x');
  const withFallbacks = resolveMarks(masked, (expression) => expression.fallback || 'x');
  if (
    isUrlContext(key, withFallbacks) ||
    (isUrlContext(key, withPlaceholders) && !MARKUP.test(withFallbacks))
  ) {
    return resolveUrl();
  }

  if (!MARKUP.test(masked)) {
    // A plain string may be rendered as HTML or bound to an attribute by a component
    const resolved = resolveMarks(
      masked,
      (expression) => value(expression) ?? fallback(expression)
    );
    const unsafe =
      MARKUP.test(resolved) || DANGEROUS_SCHEME.test(resolved.replace(IGNORED_IN_SCHEME, ''));
    return unsafe ? resolveMarks(masked, fallback) : resolved;
  }

  // Markup: lay the string out as authored, with every fallback in place, and find where browsers
  // parse text. A value replaces a fallback only when the whole fallback sits in text.
  let html = '';
  let last = 0;
  const spans: Array<[number, number]> = [];
  MARK.lastIndex = 0;
  for (let match = MARK.exec(masked); match; match = MARK.exec(masked)) {
    html += masked.slice(last, match.index);
    const authored = fallback(expressions[Number(match[1])]);
    spans.push([html.length, html.length + authored.length]);
    html += authored;
    last = MARK.lastIndex;
  }
  html += masked.slice(last);

  const layout = scanMarkup(html);
  if (!layout) {
    return html;
  }
  let output = '';
  last = 0;
  spans.forEach(([start, end], index) => {
    const expression = expressions[index];
    const tokenValue = value(expression);
    let replacement = html.slice(start, end);
    const inText = layout.text[start] && layout.text[end];
    if (
      (layout.raw[start] !== -1 && layout.raw[start] === layout.raw[end]) ||
      (inText && layout.code[start] && layout.code[end])
    ) {
      replacement = expression.source;
    } else if (tokenValue !== undefined && inText && html[start - 1] !== '<') {
      replacement = escapeHtml(tokenValue);
    }
    output += html.slice(last, start) + replacement;
    last = end;
  });
  return output + html.slice(last);

  /**
   * Replaces the token placeholders in a segment of the masked string.
   * @param {string} segment Segment of the masked string
   * @param {Function} fn Resolves one token expression; receives the placeholder offset in `segment`
   * @returns {string} Segment with tokens resolved
   */
  function resolveMarks(
    segment: string,
    fn: (expression: TokenExpression, offset: number) => string
  ): string {
    return segment.replace(MARK, (_, index: string, offset: number) =>
      fn(expressions[Number(index)], offset)
    );
  }

  /**
   * Resolves tokens in a URL. A string that is a single token takes a whole URL value; otherwise
   * values are percent-encoded and only allowed after the URL head (the scheme and host, or everything
   * before the first `/`, `?` or `#`).
   * @returns {string} Resolved URL
   */
  function resolveUrl(): string {
    if (!hasAllowedScheme(withPlaceholders)) {
      return resolveMarks(masked, fallback);
    }
    const head = getUrlHeadLength(key, masked);
    // Query strings and anchors have no head, so a single token there is only a part of the URL
    const whole = head > 0 && WHOLE_MARK.exec(masked.trim());
    if (whole) {
      const expression = expressions[Number(whole[1])];
      const url = value(expression);
      return url !== undefined && isSafeUrl(url) ? url : fallback(expression);
    }
    const resolved = resolveMarks(masked, (expression, offset) => {
      const tokenValue = offset >= head ? value(expression) : undefined;
      return tokenValue === undefined ? fallback(expression) : encodeURIComponent(tokenValue);
    });
    // Empty tokens must not turn a root-relative path into a protocol-relative URL (`/{{a}}/x` -> `//x`;
    // browsers read `\` as `/`)
    return /^\s*[/\\]{2}/.test(withPlaceholders)
      ? resolved
      : resolved.replace(/^(\s*)[/\\]{2,}/, '$1/');
  }
}

/**
 * Finds where browsers parse text in a markup string.
 * @param {string} html Markup string
 * @returns {object | undefined} For each position `i`: `text[i]` is 1 when it is in text or between
 * complete pieces of markup, `code[i]` is 1 when that text is inside `<pre>` or `<code>`, and `raw[i]`
 * is the id of the comment or raw text content that holds it (-1 when none). `undefined` when the string
 * has markup this function does not fully recognize.
 */
function scanMarkup(
  html: string
): { text: Uint8Array; code: Uint8Array; raw: Int32Array } | undefined {
  const text = new Uint8Array(html.length + 1);
  const inCode = new Uint8Array(html.length + 1);
  const raw = new Int32Array(html.length + 1).fill(-1);
  const strictRawText = MARKUP_IN_RAW_TEXT.test(html);
  let regions = 0;
  let code = 0;
  text[0] = 1;
  HTML_PIECE.lastIndex = 0;
  while (HTML_PIECE.lastIndex < html.length) {
    const start = HTML_PIECE.lastIndex;
    const match = HTML_PIECE.exec(html);
    if (!match) {
      return undefined;
    }
    const end = HTML_PIECE.lastIndex;
    if (match[1] !== undefined) {
      text.fill(1, start, end + 1);
      inCode.fill(code > 0 ? 1 : 0, start, end + 1);
      continue;
    }
    const [, , comment, , slash, name] = match;
    if (name && CODE.test(name)) {
      code = slash ? Math.max(code - 1, 0) : code + 1;
    }
    text[end] = 1;
    inCode[end] = code > 0 ? 1 : 0;
    if (comment) {
      raw.fill(regions++, start + 4, end - 2);
    }
    if (!name || slash || !RAW_TEXT.test(name)) {
      continue;
    }
    // Raw text runs to the first end tag with the same name, or to the end of the string
    const close = new RegExp(`</${name}[\\t\\n\\f\\r />]`, 'gi');
    close.lastIndex = end;
    const closeIndex = close.exec(html)?.index ?? html.length;
    const content = html.slice(end, closeIndex);
    const lowerName = name.toLowerCase();
    const escape = content.indexOf('<!--');
    if (
      ((strictRawText || lowerName === 'noscript') && MARKUP.test(content)) ||
      // In `<script>`, `<script` after `<!--` keeps the element open past the next `</script>`
      (lowerName === 'script' && escape !== -1 && SCRIPT_START.test(content.slice(escape)))
    ) {
      return undefined;
    }
    text[end] = 0;
    raw.fill(regions++, end, closeIndex + 1);
    HTML_PIECE.lastIndex = closeIndex;
  }
  return { text, code: inCode, raw };
}

/**
 * Parses the body of a `{{...}}` expression.
 * @param {string} source Full authored expression, including braces
 * @param {string} body Text between the braces
 * @returns {TokenExpression | undefined} Parsed expression, or `undefined` when the key is not a valid token key
 */
function parseExpression(source: string, body: string): TokenExpression | undefined {
  const pipe = body.indexOf('|');
  const key = (pipe === -1 ? body : body.slice(0, pipe)).trim();
  if (!TOKEN_KEY_PATTERN.test(key)) {
    return undefined;
  }
  return { source, key, fallback: pipe === -1 ? undefined : body.slice(pipe + 1).trim() };
}

/**
 * Escapes HTML special characters so a value cannot leave text context.
 * @param {string} value Raw value
 * @returns {string} Escaped value
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
