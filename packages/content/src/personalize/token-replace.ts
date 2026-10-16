import debug from '../debug';
import { getUsableTokenValue, TokenMap } from './token-map';

type HtmlContext = 'text' | 'tag' | 'attr-single' | 'attr-double' | 'script' | 'style';

type ReplaceDiagnostics = {
  onUnclosed?: () => void;
  onUnmatched?: (key: string) => void;
};

const TAG_NAME_START = /[A-Za-z/!?]/;

/**
 * Replaces mustache tokens in a string using the original-string HTML-context rules.
 *
 * Context is determined from the original string. Personalize values may be
 * HTML-escaped or rejected according to the baseline injection-protection rules.
 * Authored fallbacks are trusted CMS content and are not escaped. Inserted
 * values are literal and are not rescanned. This is baseline injection
 * protection, not general HTML sanitization.
 * @param {string} input Authored string
 * @param {TokenMap} tokens Normalized token map
 * @returns {string} String with tokens resolved
 * @public
 */
export function replaceTokens(input: string, tokens: TokenMap): string {
  return replaceTokensInternal(input, tokens, {
    onUnclosed: () => {
      debug.personalize('unclosed dynamic content token');
    },
    onUnmatched: (key) => {
      debug.personalize('unmatched dynamic content token %s', key);
    },
  });
}

/**
 * Shared token-replacement implementation behind {@link replaceTokens} and the
 * tree walker, with diagnostics supplied by the caller so each entry point can
 * log in its own context.
 * @param {string} input Authored string
 * @param {TokenMap} tokens Normalized token map
 * @param {ReplaceDiagnostics} diagnostics Optional callbacks invoked for unclosed and unmatched tokens
 * @returns {string} String with tokens resolved
 * @internal
 */
export function replaceTokensInternal(
  input: string,
  tokens: TokenMap,
  diagnostics: ReplaceDiagnostics = {}
): string {
  if (input.indexOf('{{') === -1) {
    return input;
  }

  const hasMarkup = originalHasRecognizedHtml(input);
  let state: HtmlContext = 'text';
  let i = 0;
  let output = '';
  let unclosedLogged = false;
  const unmatched = new Set<string>();

  while (i < input.length) {
    if (input[i] === '{' && input[i + 1] === '{') {
      const close = input.indexOf('}}', i + 2);
      if (close === -1) {
        if (!unclosedLogged) {
          diagnostics.onUnclosed?.();
          unclosedLogged = true;
        }
        output += input.slice(i);
        break;
      }

      const body = input.slice(i + 2, close);
      output += resolveTokenExpression(body, tokens, state, hasMarkup, unmatched);
      i = close + 2;
      continue;
    }

    state = advanceHtmlState(input, i, state);
    output += input[i];
    i += 1;
  }

  for (const key of unmatched) {
    diagnostics.onUnmatched?.(key);
  }

  return output;
}

/**
 * Resolves a single `{{...}}` expression body to its replacement text.
 *
 * Returns the token value when one is usable and the insertion rules permit it,
 * otherwise the authored fallback, otherwise an empty string. Nested braces are
 * treated as malformed and drop the expression.
 * @param {string} body Expression body between the braces, excluding the delimiters
 * @param {TokenMap} tokens Normalized token map
 * @param {HtmlContext} state HTML context of the expression within the original string
 * @param {boolean} hasMarkup Whether the original string contains recognized markup
 * @param {Set<string>} unmatched Collects keys with no usable token, for deferred logging
 * @returns {string} Replacement text for the expression
 */
function resolveTokenExpression(
  body: string,
  tokens: TokenMap,
  state: HtmlContext,
  hasMarkup: boolean,
  unmatched: Set<string>
): string {
  if (body.indexOf('{') !== -1 || body.indexOf('}') !== -1) {
    return '';
  }

  const pipe = body.indexOf('|');
  const rawKey = pipe === -1 ? body : body.slice(0, pipe);
  const key = rawKey.trim();
  const hasFallback = pipe !== -1;
  const fallback = hasFallback ? body.slice(pipe + 1) : undefined;

  if (!key) {
    return '';
  }

  const usable = getUsableTokenValue(tokens, key);
  if (usable !== undefined) {
    const inserted = applyInsertionRules(usable, state, hasMarkup);
    if (inserted !== undefined) {
      return inserted;
    }
  } else {
    unmatched.add(key);
  }

  if (hasFallback) {
    return fallback as string;
  }
  return '';
}

/**
 * Applies the baseline injection-protection rules for inserting a personalize
 * value.
 *
 * Values are only ever inserted in text context. Where the original string
 * already contains markup the value is escaped; where it does not, a value
 * containing `<` is rejected outright rather than escaped, so token values can
 * never introduce markup into a plain-text string.
 * @param {string} value Usable token value
 * @param {HtmlContext} state HTML context at the insertion point
 * @param {boolean} hasMarkup Whether the original string contains recognized markup
 * @returns {string | undefined} Text to insert, or `undefined` when insertion is rejected
 */
function applyInsertionRules(
  value: string,
  state: HtmlContext,
  hasMarkup: boolean
): string | undefined {
  if (state !== 'text') {
    return undefined;
  }
  if (hasMarkup) {
    return escapeHtml(value);
  }
  if (value.indexOf('<') !== -1) {
    return undefined;
  }
  return value;
}

/**
 * Escapes the HTML special characters that could otherwise break out of text
 * context.
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

/**
 * Reports whether the authored string contains at least one recognized tag,
 * which selects between the escaping and rejection insertion rules.
 * @param {string} input Authored string
 * @returns {boolean} True when the string contains recognized markup
 */
function originalHasRecognizedHtml(input: string): boolean {
  for (let i = 0; i < input.length; i++) {
    if (isRecognizedTagStart(input, i)) {
      return true;
    }
  }
  return false;
}

/**
 * Reports whether a tag opens at the given index.
 *
 * A `<` must be followed by a tag-name start character, and must not itself be
 * preceded by `<`, so sequences such as `<<div` are treated as ordinary text.
 * @param {string} input Authored string
 * @param {number} index Index to test
 * @returns {boolean} True when a tag starts at the index
 */
function isRecognizedTagStart(input: string, index: number): boolean {
  if (input[index] !== '<' || !input[index + 1] || !TAG_NAME_START.test(input[index + 1])) {
    return false;
  }
  // `<<div` is ordinary text; only a `<` that is not itself preceded by `<` opens a tag.
  return input[index - 1] !== '<';
}

/**
 * Advances the HTML context state machine by one character.
 *
 * Tracks text, tag, single- and double-quoted attribute values, and raw-text
 * `script` and `style` element bodies. This is a context tracker for deciding
 * where a token value may be inserted, not a conforming HTML parser.
 * @param {string} input Authored string
 * @param {number} index Index of the character being consumed
 * @param {HtmlContext} state Current context
 * @returns {HtmlContext} Context after consuming the character
 */
function advanceHtmlState(input: string, index: number, state: HtmlContext): HtmlContext {
  const ch = input[index];

  if (state === 'script') {
    if (startsWithIgnoreCase(input, index, '</script>')) {
      return 'text';
    }
    return 'script';
  }

  if (state === 'style') {
    if (startsWithIgnoreCase(input, index, '</style>')) {
      return 'text';
    }
    return 'style';
  }

  if (state === 'attr-double') {
    return ch === '"' ? 'tag' : 'attr-double';
  }

  if (state === 'attr-single') {
    return ch === "'" ? 'tag' : 'attr-single';
  }

  if (state === 'tag') {
    if (ch === '"') {
      return 'attr-double';
    }
    if (ch === "'") {
      return 'attr-single';
    }
    if (ch === '>') {
      if (isSelfClosingTag(input, index)) {
        return 'text';
      }
      const tagName = tagNameAt(input, index);
      return tagName === 'script' ? 'script' : tagName === 'style' ? 'style' : 'text';
    }
    return 'tag';
  }

  if (isRecognizedTagStart(input, index)) {
    return 'tag';
  }

  return 'text';
}

/**
 * Reads the lower-cased tag name of the tag closed by the `>` at the given
 * index, used to detect entry into `script` and `style` raw-text elements.
 * @param {string} input Authored string
 * @param {number} gtIndex Index of the closing `>`
 * @returns {string} Lower-cased tag name, or an empty string when none is found
 */
function tagNameAt(input: string, gtIndex: number): string {
  let start = gtIndex;
  while (start > 0 && input[start] !== '<') {
    start -= 1;
  }
  if (input[start] !== '<') {
    return '';
  }
  let i = start + 1;
  if (input[i] === '/') {
    return '';
  }
  const nameStart = i;
  while (i < gtIndex && /[A-Za-z]/.test(input[i])) {
    i += 1;
  }
  return input.slice(nameStart, i).toLowerCase();
}

/**
 * Reports whether the tag closed at the given index is self-closing, so that
 * `<script />` does not put the state machine into raw-text mode.
 * @param {string} input Authored string
 * @param {number} gtIndex Index of the closing `>`
 * @returns {boolean} True when the tag is self-closing
 */
function isSelfClosingTag(input: string, gtIndex: number): boolean {
  let i = gtIndex - 1;
  while (i >= 0 && /\s/.test(input[i])) {
    i -= 1;
  }
  return input[i] === '/';
}

/**
 * Case-insensitive equivalent of `String.prototype.startsWith` applied at an
 * offset, avoiding a substring allocation on every character.
 * @param {string} input Authored string
 * @param {number} index Offset to compare from
 * @param {string} token Lower-cased token to compare against
 * @returns {boolean} True when the input matches the token at the offset
 */
function startsWithIgnoreCase(input: string, index: number, token: string): boolean {
  if (index + token.length > input.length) {
    return false;
  }
  return input.slice(index, index + token.length).toLowerCase() === token;
}

