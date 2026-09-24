import type { IncomingHttpHeaders } from 'http';
import { PERSONALIZE_TOKENS_HEADER, TokenMap } from '@sitecore-content-sdk/content/personalize';
import { decodePersonalizeTokensHeaderDetailed } from '@sitecore-content-sdk/content/personalize/internal';
import debug from '../debug';

/**
 * Reads the trusted personalize token header.
 *
 * Missing header → `undefined`. Valid encoded map → decoded map, including `{}`.
 * Present but invalid or oversized → debug warning and `{}`.
 * Lookup is case-insensitive. For Node `string[]` values, the first value is used.
 *
 * The header is not authenticated. Stock hosts rely on PersonalizeProxy to strip
 * inbound client values before this reader runs. A custom chain that omits that
 * proxy must strip `x-sc-personalize-tokens` itself before calling this helper.
 *
 * Activation: `undefined` (missing header) means do not process tokens if you
 * pass it through as `pageOptions.tokens`. Stock hosts use
 * `readPersonalizeTokens(headers) ?? {}` so processing is always on for
 * normal renders (`{}` = fallbacks / removal).
 * @param {Headers | IncomingHttpHeaders | undefined} headers Request headers
 * @returns {TokenMap | undefined} Decoded tokens, empty map, or undefined
 * @public
 */
export function readPersonalizeTokens(
  headers: Headers | IncomingHttpHeaders | undefined
): TokenMap | undefined {
  if (!headers) {
    return undefined;
  }

  const value = getHeaderValue(headers, PERSONALIZE_TOKENS_HEADER);
  if (value === undefined) {
    return undefined;
  }

  const decoded = decodePersonalizeTokensHeaderDetailed(value);
  if (decoded.ok) {
    return decoded.tokens;
  }

  debug.personalize(
    'invalid personalize tokens header reason=%s encodedBytes=%s',
    decoded.reason,
    decoded.encodedBytes ?? 'n/a'
  );
  return {};
}

function getHeaderValue(
  headers: Headers | IncomingHttpHeaders,
  name: string
): string | undefined {
  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    return firstHeaderValue(headers.get(name) ?? undefined);
  }

  if (typeof (headers as Headers).get === 'function' && !Array.isArray(headers)) {
    return firstHeaderValue((headers as Headers).get(name) ?? undefined);
  }

  const record = headers as IncomingHttpHeaders;
  const match = Object.keys(record).find((key) => key.toLowerCase() === name.toLowerCase());
  if (!match) {
    return undefined;
  }
  return firstHeaderValue(record[match]);
}

function firstHeaderValue(value: string | string[] | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}
