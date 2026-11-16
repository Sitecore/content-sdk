import debug from '../debug';
import { normalizeTokens, TokenMap } from './token-map';

/**
 * Request header that carries Personalize tokens from the personalize proxy / middleware to the
 * render. The proxy / middleware removes any inbound value and is the only writer.
 * The value can contain visitor data: do not log it.
 * @internal
 */
export const PERSONALIZE_TOKENS_HEADER = 'x-sc-personalize-tokens';

/**
 * Maximum encoded header length. Larger token maps are dropped (fallbacks render instead)
 * so the request never fails on header size limits.
 * @internal
 */
export const PERSONALIZE_TOKENS_MAX_LENGTH = 7000;

/**
 * Request headers as Web `Headers` or a Node.js / Express header object.
 * @public
 */
export type PersonalizeTokensHeaders =
  | Pick<Headers, 'get'>
  | Record<string, string | string[] | undefined>;

/**
 * Encodes a token map for {@link PERSONALIZE_TOKENS_HEADER} as URI-encoded JSON, which is safe for
 * any header value regardless of the characters in the tokens.
 * @param {TokenMap} tokens Normalized token map
 * @returns {string | undefined} Encoded value, or `undefined` when the map is empty or too large
 * @internal
 */
export function encodePersonalizeTokens(tokens: TokenMap): string | undefined {
  if (Object.keys(tokens).length === 0) {
    return undefined;
  }
  const encoded = encodeURIComponent(JSON.stringify(tokens));
  if (encoded.length > PERSONALIZE_TOKENS_MAX_LENGTH) {
    debug.personalize(
      'dynamic content tokens dropped: encoded length %d exceeds %d',
      encoded.length,
      PERSONALIZE_TOKENS_MAX_LENGTH
    );
    return undefined;
  }
  return encoded;
}

/**
 * Returns the dynamic content tokens that the personalize proxy / middleware forwarded for the
 * current request, for `getPage(path, { tokens })`. Returns `undefined` when there are none.
 * The proxy / middleware removes any client-sent value, so read it only on requests that passed through it.
 * @param {PersonalizeTokensHeaders | null | undefined} headers Request headers
 * @returns {TokenMap | undefined} Tokens, or `undefined` when there are none
 * @public
 */
export function getPersonalizeTokens(
  headers: PersonalizeTokensHeaders | null | undefined
): TokenMap | undefined {
  const raw =
    typeof (headers as Headers | undefined)?.get === 'function'
      ? (headers as Pick<Headers, 'get'>).get(PERSONALIZE_TOKENS_HEADER)
      : (headers as Record<string, string | string[] | undefined> | undefined)?.[
          PERSONALIZE_TOKENS_HEADER
        ];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) {
    return undefined;
  }
  try {
    const tokens = normalizeTokens(JSON.parse(decodeURIComponent(value)));
    return Object.keys(tokens).length > 0 ? tokens : undefined;
  } catch {
    debug.personalize('dynamic content tokens header ignored: invalid value');
    return undefined;
  }
}
