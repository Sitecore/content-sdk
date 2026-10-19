import { LayoutStringTransform } from '../layout/layout-walker';
import { getTokenValue, TOKEN_KEY_PATTERN, TokenMap } from './token-map';
import { isSafeUrlValue, isUrlContext } from './token-url';

const TOKEN_EXPRESSION = /\{\{([^{}]*)\}\}/g;
// Private-use characters mark token positions while the surrounding markup is classified.
const MARK_OPEN = '\uE000';
const MARK_CLOSE = '\uE001';
const MARK = /\uE000(\d+)\uE001/g;
const MARKUP = /<[A-Za-z/!?]/;
// Browsers ignore whitespace and control characters inside a URL scheme (for example `java\tscript:`).
// eslint-disable-next-line no-control-regex
const IGNORED_IN_SCHEME = /[\u0000-\u0020]/g;
const DANGEROUS_SCHEME = /^(?:javascript|vbscript|data):/i;
const TAG_BODY = `(?:"[^"]*(?:"|$)|'[^']*(?:'|$)|[^'">])*`;
// Markup that is not text: comments, raw blocks whose content is kept as authored, and tags.
// Unterminated quotes and tags run to the end of the string, so they are never treated as text.
const NON_TEXT = new RegExp(
  [
    '<!--[\\s\\S]*?(?:-->|$)',
    `<(script|style|pre|code|textarea)\\b${TAG_BODY}>[\\s\\S]*?(?:<\\/\\1\\s*>|$)`,
    `<[A-Za-z/!?]${TAG_BODY}>?`,
  ].join('|'),
  'gi'
);

type TokenExpression = { source: string; key: string; fallback?: string };
type Context = 'text' | 'tag' | 'raw';

/**
 * Resolves dynamic content tokens (`{{key}}`, `{{key|fallback}}`) in an authored string.
 *
 * - Keys must match `[A-Za-z0-9_.-]+`; other `{{...}}` text (and `{{{...}}}`) is left as authored.
 * - A token with no usable value renders its fallback, or is removed when it has none.
 * - Personalize values are inserted only as text. In strings that contain markup they are
 * HTML-escaped; in plain strings a value containing `<` or starting with a `javascript:`, `vbscript:`
 * or `data:` scheme is not inserted (the fallback is used).
 * - Inside a tag (for example an attribute) only the authored fallback is used.
 * - Inside comments and `<script>`, `<style>`, `<pre>`, `<code>`, `<textarea>` the text is kept as authored.
 * - In URLs (`href`, `src`, `url`, `srcSet` properties, or a string that is entirely a URL) values are
 * percent-encoded as a URL component, and a result that is not a safe URL renders fallbacks only.
 *
 * Fallbacks are trusted authored content and are inserted as written.
 * @param {string} input Authored string
 * @param {TokenMap} tokens Token map
 * @param {string} [key] Own property name of the string, used to detect URL properties
 * @param {(key: string) => void} [onUnmatched] Called for each token key without a usable value
 * @returns {string} Resolved string, or `input` when it has no tokens
 * @internal
 */
export function replaceTokens(
  input: string,
  tokens: TokenMap,
  key?: string,
  onUnmatched?: (key: string) => void
): string {
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

  for (const expression of expressions) {
    if (getTokenValue(tokens, expression.key) === undefined) {
      onUnmatched?.(expression.key);
    }
  }

  // Classify with a placeholder and with the fallbacks in place, so `/p/{{city|new york}}` and
  // `{{url|/home}}` are both recognized as URLs
  const withFallbacks = masked.replace(
    MARK,
    (_, index: string) => expressions[Number(index)].fallback || 'x'
  );
  if (isUrlContext(key, masked.replace(MARK, 'x')) || isUrlContext(key, withFallbacks)) {
    const resolved = resolveUrl(masked, expressions, tokens, true);
    return isSafeUrlValue(key, resolved) ? resolved : resolveUrl(masked, expressions, tokens, false);
  }

  if (!MARKUP.test(masked)) {
    return resolveMarks(masked, (expression) => resolve(expression, tokens, 'text', false));
  }

  let output = '';
  let last = 0;
  NON_TEXT.lastIndex = 0;
  for (let match = NON_TEXT.exec(masked); match; match = NON_TEXT.exec(masked)) {
    const segment = match[0];
    if (segment === '') {
      NON_TEXT.lastIndex++;
      continue;
    }
    output += resolveMarks(masked.slice(last, match.index), (expression) =>
      resolve(expression, tokens, 'text', true)
    );
    const context: Context = (match[1] || segment.startsWith('<!--')) ? 'raw' : 'tag';
    output += resolveMarks(segment, (expression) => resolve(expression, tokens, context, true));
    last = match.index + segment.length;
  }
  output += resolveMarks(masked.slice(last), (expression) =>
    resolve(expression, tokens, 'text', true)
  );
  return output;

  /**
   * Replaces the token placeholders in a segment of the masked string.
   * @param {string} value Segment of the masked string
   * @param {Function} fn Resolves one token expression
   * @returns {string} Segment with tokens resolved
   */
  function resolveMarks(value: string, fn: (expression: TokenExpression) => string): string {
    return value.replace(MARK, (_, index: string) => fn(expressions[Number(index)]));
  }
}

/**
 * Creates a layout string transform that resolves tokens in every string it is given and
 * records the keys that had no value.
 * @param {TokenMap} tokens Token map
 * @returns {{ transform: LayoutStringTransform; unmatched: Set<string> }} Transform and unmatched keys
 * @internal
 */
export function createTokenTransform(tokens: TokenMap): {
  transform: LayoutStringTransform;
  unmatched: Set<string>;
} {
  const unmatched = new Set<string>();
  return {
    unmatched,
    transform: (value, key) => replaceTokens(value, tokens, key, (k) => unmatched.add(k)),
  };
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
  return { source, key, fallback: pipe === -1 ? undefined : body.slice(pipe + 1) };
}

/**
 * Resolves one token for its context: a value (text only, escaped when the string has markup),
 * else the fallback, else an empty string. Raw contexts keep the authored expression.
 * @param {TokenExpression} expression Token expression
 * @param {TokenMap} tokens Token map
 * @param {Context} context Context of the token in the authored string
 * @param {boolean} hasMarkup Whether the authored string contains markup
 * @returns {string} Replacement text
 */
function resolve(
  expression: TokenExpression,
  tokens: TokenMap,
  context: Context,
  hasMarkup: boolean
): string {
  if (context === 'raw') {
    return expression.source;
  }
  const value = context === 'text' ? getTokenValue(tokens, expression.key) : undefined;
  if (value !== undefined) {
    if (hasMarkup) {
      return escapeHtml(value);
    }
    // A plain string may be rendered as HTML or bound to an attribute by a component
    if (value.indexOf('<') === -1 && !DANGEROUS_SCHEME.test(value.replace(IGNORED_IN_SCHEME, ''))) {
      return value;
    }
  }
  return expression.fallback ?? '';
}

/**
 * Resolves tokens in a URL: values are percent-encoded as a URL component.
 * @param {string} masked Authored string with placeholders
 * @param {TokenExpression[]} expressions Parsed expressions, indexed by placeholder
 * @param {TokenMap} tokens Token map
 * @param {boolean} useValues When false, only fallbacks are used
 * @returns {string} Resolved URL
 */
function resolveUrl(
  masked: string,
  expressions: TokenExpression[],
  tokens: TokenMap,
  useValues: boolean
): string {
  return masked.replace(MARK, (_, index: string) => {
    const expression = expressions[Number(index)];
    const value = useValues ? getTokenValue(tokens, expression.key) : undefined;
    return value !== undefined ? encodeURIComponent(value) : expression.fallback ?? '';
  });
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
