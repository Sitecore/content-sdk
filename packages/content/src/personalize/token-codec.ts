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
 * Encodes a token map for {@link PERSONALIZE_TOKENS_HEADER} as base64url UTF-8 JSON, which is
 * safe for any header value regardless of the characters in the tokens.
 * @param {TokenMap} tokens Token map
 * @returns {string | undefined} Encoded value, or `undefined` when the map is empty or too large
 * @internal
 */
export function encodePersonalizeTokens(tokens: TokenMap): string | undefined {
  const normalized = normalizeTokens(tokens);
  if (Object.keys(normalized).length === 0) {
    return undefined;
  }
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(normalized)));
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
 * Decodes a {@link PERSONALIZE_TOKENS_HEADER} value.
 * @param {string | null | undefined} value Header value
 * @returns {TokenMap | undefined} Tokens, or `undefined` when the value is missing, empty or invalid
 * @internal
 */
export function decodePersonalizeTokens(value: string | null | undefined): TokenMap | undefined {
  if (!value) {
    return undefined;
  }
  if (value.length > PERSONALIZE_TOKENS_MAX_LENGTH) {
    debug.personalize('dynamic content tokens header ignored: too large');
    return undefined;
  }
  try {
    const json = new TextDecoder('utf-8', { fatal: true }).decode(fromBase64Url(value));
    const tokens = normalizeTokens(JSON.parse(json));
    return Object.keys(tokens).length > 0 ? tokens : undefined;
  } catch {
    debug.personalize('dynamic content tokens header ignored: invalid value');
    return undefined;
  }
}

/**
 * Encodes bytes as unpadded base64url. Uses `btoa` instead of `Buffer` so the codec behaves the
 * same on Node and Edge runtimes.
 * @param {Uint8Array} bytes Bytes to encode
 * @returns {string} base64url string
 */
function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes base64url (or standard base64) to bytes. Throws on invalid input.
 * @param {string} value Encoded value
 * @returns {Uint8Array} Decoded bytes
 */
function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
