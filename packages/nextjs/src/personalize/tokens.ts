import type { IncomingHttpHeaders } from 'http';
import {
  decodePersonalizeTokens,
  hasPersonalizeTokensRewrite,
  PERSONALIZE_TOKENS_HEADER,
  TokenMap,
} from '@sitecore-content-sdk/content/personalize';

/**
 * Returns the dynamic content tokens that PersonalizeProxy forwarded for this request, for
 * `getPage(path, { tokens })`.
 *
 * Headers are read only when the (rewritten) path carries the tokens marker that PersonalizeProxy
 * adds when Personalize returned tokens. Renders without tokens never touch request headers, so
 * they stay static.
 * @param {string | string[] | undefined} path Route path or path segments received by the page
 * @param {Function} getHeaders Returns the request headers
 * (for example `headers` from `next/headers`, or `() => context.req.headers`); called only when needed
 * @returns {Promise<TokenMap | undefined>} Tokens, or `undefined` when there are none
 * @public
 * @example
 * // App Router
 * import { headers } from 'next/headers';
 * const page = await client.getPage(path ?? [], {
 *   site,
 *   locale,
 *   tokens: await getPersonalizeTokens(path, headers),
 * });
 * @example
 * // Pages Router (getServerSideProps)
 * const page = await client.getPage(path, {
 *   locale: context.locale,
 *   tokens: await getPersonalizeTokens(path, () => context.req.headers),
 * });
 */
export async function getPersonalizeTokens(
  path: string | string[] | undefined,
  getHeaders: () =>
    | Pick<Headers, 'get'>
    | IncomingHttpHeaders
    | Promise<Pick<Headers, 'get'> | IncomingHttpHeaders>
): Promise<TokenMap | undefined> {
  if (!path || !hasPersonalizeTokensRewrite(path)) {
    return undefined;
  }
  return decodePersonalizeTokens(getHeaderValue(await getHeaders()));
}

/**
 * Reads the tokens header from web or Node request headers.
 * @param {Pick<Headers, 'get'> | IncomingHttpHeaders} headers Request headers
 * @returns {string | undefined} Header value
 */
function getHeaderValue(headers: Pick<Headers, 'get'> | IncomingHttpHeaders): string | undefined {
  if (typeof (headers as Headers).get === 'function') {
    return (headers as Headers).get(PERSONALIZE_TOKENS_HEADER) ?? undefined;
  }
  const value = (headers as IncomingHttpHeaders)[PERSONALIZE_TOKENS_HEADER];
  return Array.isArray(value) ? value[0] : value;
}
