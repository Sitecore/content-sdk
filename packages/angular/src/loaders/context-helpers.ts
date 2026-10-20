import type { CsdkRequestData, LoaderContext } from './models';
import {
  DEFAULT_VARIANT,
  decodePersonalizeTokens,
  PERSONALIZE_TOKENS_HEADER,
  TokenMap,
} from '@sitecore-content-sdk/content/personalize';

/**
 * Read the site name resolved for the current request (multisite middleware →
 * `scParams`, with the configured default site applied by the server loader runner).
 * @param {LoaderContext} context - Loader context.
 * @returns {string} Site name for the current request.
 * @public
 */
export function getSiteName(context: LoaderContext): string {
  return context.scParams.siteName;
}

/**
 * Read the page-level personalization variant id resolved for the current request
 * (personalize middleware → `scParams`). Returns the default variant id when the
 * request was not personalized.
 * @param {LoaderContext} context - Loader context.
 * @returns {string} Page-level variant id.
 * @public
 */
export function getVariantId(context: LoaderContext): string {
  return context.scParams.variantId ?? DEFAULT_VARIANT;
}

/**
 * Read the component A/B test variant ids resolved for the current request
 * (personalize middleware → `scParams`). Empty when the request was not personalized.
 * @param {LoaderContext} context - Loader context.
 * @returns {string[]} Component-level variant ids.
 * @public
 */
export function getComponentVariantIds(context: LoaderContext): string[] {
  return context.scParams.componentVariantIds ?? [];
}

/**
 * Read the language for the current request from the matched route params
 * (`scLocaleMatcher` exposes the locale URL segment as `routeParams.locale`).
 * Returns `undefined` when no locale was matched — fall back to your
 * configured default language.
 * @param {LoaderContext} context - Loader context.
 * @returns {string | undefined} Language for the current request.
 * @public
 */
export function getLanguage(context: LoaderContext): string | undefined {
  const locale = context.routeParams.locale;
  return typeof locale === 'string' ? locale : undefined;
}

/**
 * Read the dynamic content tokens that the personalize middleware forwarded for the current
 * request, for `getPage(path, { tokens })`. Returns `undefined` when there are none.
 * The personalize middleware removes any client-sent value, so keep it in the server chain.
 * @param {LoaderContext} context - Loader context.
 * @returns {TokenMap | undefined} Tokens for the current request.
 * @public
 */
export function getPersonalizeTokens(context: LoaderContext): TokenMap | undefined {
  return readPersonalizeTokens(context.csdkRequestData?.headers);
}

/**
 * Decode the dynamic content tokens header from request headers.
 * @param {CsdkRequestData['headers']} headers - Request headers.
 * @returns {TokenMap | undefined} Tokens, or `undefined` when there are none.
 * @internal
 */
export function readPersonalizeTokens(headers: CsdkRequestData['headers']): TokenMap | undefined {
  const value = headers?.[PERSONALIZE_TOKENS_HEADER];
  return decodePersonalizeTokens(Array.isArray(value) ? value[0] : value);
}
