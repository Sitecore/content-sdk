import type { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';
import { getLocaleRewrite } from '@sitecore-content-sdk/content/i18n';

/**
 * Result of locale extraction from a URL path.
 * @public
 */
export interface LocaleExtractionResult {
  /** Configured locale found at the start of the path, or `null` when absent. */
  locale: string | null;
  /** Remainder of the path after the locale segment (always starts with `/`). */
  rest: string;
}

/**
 * Extracts a configured locale from the first segment of a URL pathname.
 * Returns `{ locale: null, rest: pathname }` when the first segment is not a configured locale.
 * @param {string} pathname - URL pathname, with or without leading `/`.
 * @param {string[]} locales - Configured locales.
 * @returns {LocaleExtractionResult} Detected locale and the rest of the path.
 * @public
 */
export function extractLocaleFromPath(pathname: string, locales: string[]): LocaleExtractionResult {
  if (!pathname) {
    return { locale: null, rest: '/' };
  }
  const normalized = pathname.startsWith('/') ? pathname : '/' + pathname;
  const queryIndex = normalized.search(/[?#]/);
  const pathOnly = queryIndex === -1 ? normalized : normalized.slice(0, queryIndex);
  const suffix = queryIndex === -1 ? '' : normalized.slice(queryIndex);
  const firstSlash = pathOnly.indexOf('/', 1);
  const firstSegment = firstSlash === -1 ? pathOnly.slice(1) : pathOnly.slice(1, firstSlash);

  if (firstSegment && locales.includes(firstSegment)) {
    const rest = firstSlash === -1 ? '/' : pathOnly.slice(firstSlash);
    return { locale: firstSegment, rest: (rest || '/') + suffix };
  }
  return { locale: null, rest: pathname };
}

/**
 * Prepends a locale segment to a URL pathname. No-op when `locale` is `null` or empty.
 * Delegates to {@link getLocaleRewrite} from `@sitecore-content-sdk/content/i18n`.
 * @param {string} pathname - URL pathname.
 * @param {string | null} locale - Locale to prepend, or `null` to skip.
 * @returns {string} Locale-prefixed pathname, or the original when `locale` is `null` or empty.
 * @public
 */
export function prependLocale(pathname: string, locale: string | null): string {
  if (!locale) {
    return pathname;
  }
  return getLocaleRewrite(pathname, locale);
}

/**
 * Creates an Angular {@link UrlMatcher} that consumes a configured-locale segment from
 * the start of a route. When the first URL segment matches one of `locales`, it is consumed
 * and exposed as the `locale` route param. Otherwise zero segments are consumed and the
 * route still matches (so error routes and the catchall handle both prefixed and unprefixed
 * URLs from the same route tree).
 * @param {string[]} locales - Configured locales.
 * @returns {UrlMatcher} Angular URL matcher for locale-prefixed route trees.
 * @public
 */
export function createLocaleMatcher(locales: string[]): UrlMatcher {
  return (segments: UrlSegment[]): UrlMatchResult => {
    if (segments.length > 0 && locales.includes(segments[0].path)) {
      return { consumed: [segments[0]], posParams: { locale: segments[0] } };
    }
    return { consumed: [] };
  };
}
