import {
  createEmptyTokenMap,
  isPlainObject,
  mergePersonalizeTokens,
  TokenMap,
} from './token-map';

/**
 * Trusted **request** header used to forward a normalized token map
 * (`x-sc-personalize-tokens`). Middleware / PersonalizeProxy is the trusted
 * writer. Base64 is encoding, not authentication, integrity, or confidentiality.
 * Clients may spoof the header. Inbound client values must be removed before
 * forwarding. Values may contain visitor PII and must not be logged or included
 * in debug header dumps.
 * @public
 */
export const PERSONALIZE_TOKENS_HEADER = 'x-sc-personalize-tokens';

/**
 * Maximum canonical base64 encoded length, in bytes, for the token header.
 * @public
 */
export const PERSONALIZE_TOKENS_HEADER_MAX_BYTES = 7000;

/**
 * Angular `x-sitecore-params` envelope UTF-8 budget. Same numeric cap as the
 * common token header so a map rejected on Next is never accepted on Angular.
 * @internal
 */
export const PERSONALIZE_SCPARAMS_ENVELOPE_MAX_BYTES = PERSONALIZE_TOKENS_HEADER_MAX_BYTES;

/**
 * Encodes a map and replaces it with `{}` when the common header budget is exceeded.
 * @param {TokenMap} tokens Normalized token map
 * @returns {{ tokens: TokenMap; encoded: string; oversized: boolean }} Clamped result
 * @internal
 */
export function clampEncodedTokenMap(tokens: TokenMap): {
  tokens: TokenMap;
  encoded: string;
  oversized: boolean;
} {
  const encoded = encodePersonalizeTokensHeader(tokens);
  if (encoded.length <= PERSONALIZE_TOKENS_HEADER_MAX_BYTES) {
    return { tokens, encoded, oversized: false };
  }
  const empty = createEmptyTokenMap();
  return {
    tokens: empty,
    encoded: encodePersonalizeTokensHeader(empty),
    oversized: true,
  };
}

const CANONICAL_BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;

/**
 * @internal
 */
export type TokenDecodeFailureReason =
  | 'oversized'
  | 'invalid-base64'
  | 'invalid-utf8'
  | 'invalid-json'
  | 'invalid-shape';

/**
 * @internal
 */
export type TokenDecodeResult =
  | { ok: true; tokens: TokenMap }
  | { ok: false; reason: TokenDecodeFailureReason; encodedBytes?: number };

/**
 * Encodes a token map as canonical base64 UTF-8 JSON for the trusted header.
 * Defensively normalizes own string and finite-number properties and skips
 * inherited, unsupported, and dangerous keys. An empty map encodes successfully.
 * @param {TokenMap} tokens Token map
 * @returns {string} Canonical base64 payload
 * @public
 */
export function encodePersonalizeTokensHeader(tokens: TokenMap): string {
  const normalized = createEmptyTokenMap();
  mergePersonalizeTokens(normalized, tokens);
  const json = JSON.stringify(toJsonObject(normalized));
  return encodeCanonicalBase64(utf8Encode(json));
}

/**
 * Decodes a trusted token header value.
 * Returns null for oversized, non-canonical, invalid, or malformed payloads.
 * @param {string} value Encoded header value
 * @returns {TokenMap | null} Normalized map, including `{}`, or null
 * @public
 */
export function decodePersonalizeTokensHeader(value: string): TokenMap | null {
  const result = decodePersonalizeTokensHeaderDetailed(value);
  return result.ok ? result.tokens : null;
}

/**
 * Detailed decoder used by host helpers so a reason is available without
 * parsing twice. Remains internal.
 * @param {string} value Encoded header value
 * @returns {TokenDecodeResult} Detailed decode result
 * @internal
 */
export function decodePersonalizeTokensHeaderDetailed(value: string): TokenDecodeResult {
  const encodedBytes = value.length;
  if (encodedBytes > PERSONALIZE_TOKENS_HEADER_MAX_BYTES) {
    return { ok: false, reason: 'oversized', encodedBytes };
  }
  if (!CANONICAL_BASE64.test(value) || value.length % 4 !== 0) {
    return { ok: false, reason: 'invalid-base64', encodedBytes };
  }

  const bytes = decodeCanonicalBase64(value);
  if (!bytes) {
    return { ok: false, reason: 'invalid-base64', encodedBytes };
  }

  let json: string;
  try {
    json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return { ok: false, reason: 'invalid-utf8', encodedBytes };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, reason: 'invalid-json', encodedBytes };
  }

  if (!isPlainObject(parsed)) {
    return { ok: false, reason: 'invalid-shape', encodedBytes };
  }

  const tokens = createEmptyTokenMap();
  mergePersonalizeTokens(tokens, parsed);
  return { ok: true, tokens };
}

/**
 * Copies a token map into a plain JSON-serializable object.
 *
 * Token maps are created with a null prototype, so this produces an ordinary
 * object suitable for `JSON.stringify`.
 * @param {TokenMap} tokens Normalized token map
 * @returns {Record<string, string>} Plain object with the same entries
 */
function toJsonObject(tokens: TokenMap): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(tokens)) {
    result[key] = tokens[key];
  }
  return result;
}

/**
 * Encodes a string as UTF-8 bytes using the platform `TextEncoder`, which is
 * available on both Node and Edge runtimes.
 * @param {string} value String to encode
 * @returns {Uint8Array} UTF-8 bytes
 */
function utf8Encode(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

/**
 * Encodes bytes as standard padded base64 via `btoa`, avoiding `Buffer` so the
 * codec behaves identically on Node and Edge runtimes.
 * @param {Uint8Array} bytes Bytes to encode
 * @returns {string} Base64 string
 */
function encodeCanonicalBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a base64 string, rejecting any non-canonical encoding.
 *
 * `atob` accepts inputs that do not round-trip, so the decoded bytes are
 * re-encoded and compared against the input. Anything that does not match
 * exactly is rejected, which keeps the header a single canonical form.
 * @param {string} value Base64 string
 * @returns {Uint8Array | null} Decoded bytes, or `null` when the input is not canonical base64
 */
function decodeCanonicalBase64(value: string): Uint8Array | null {
  try {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    if (encodeCanonicalBase64(bytes) !== value) {
      return null;
    }
    return bytes;
  } catch {
    return null;
  }
}
