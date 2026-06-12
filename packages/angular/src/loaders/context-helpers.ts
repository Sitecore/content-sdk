import type { LoaderContext } from './models';

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
  return context.scParams.variantId;
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
