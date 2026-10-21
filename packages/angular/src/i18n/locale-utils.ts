import type { UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router';

/**
 * Result of locale extraction from a URL path.
 * @public
 */
export interface LocaleExtractionResult {
  /** Configured locale found at the start of the path, or `null` when absent. */
  locale: string | null;
  /** Remainder of the path after the locale segment (always starts with `/`). */
  nonLocalePath: string;
  /** Query or fragment string found at the end of the path, or `null` when absent. */
  queryFragment?: string;
}

/**
 * Parses a normalized pathname into its first segment, remainder path, and query/fragment suffix.
 * Groups: (1) first segment, (2) rest of path including leading slash, (3) ?query and/or #fragment.
 */
const PATH_PARTS_REGEX = /^\/([^/?#]*)(\/[^?#]*)?([?#].*)?$/;

/**
 * Extracts a configured locale from the first segment of a URL pathname.
 * Returns `{ locale: null, nonLocalePath: pathname, queryFragment: query or fragment string }` when the first segment is not a configured locale.
 * @param {string} pathname - URL pathname, with or without leading `/`.
 * @param {string[]} locales - Configured locales.
 * @returns {LocaleExtractionResult} Detected locale and the rest of the path.
 * @public
 */
export function splitLocaleFromPath(pathname: string, locales: string[]): LocaleExtractionResult {
  if (!pathname) {
    return { locale: null, nonLocalePath: '/' };
  }
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const [, firstSegment = '', restPath = '', queryFragment = undefined] =
    normalized.match(PATH_PARTS_REGEX) ?? [];

  if (firstSegment && locales.includes(firstSegment)) {
    return { locale: firstSegment, nonLocalePath: restPath || '/', queryFragment };
  }
  return { locale: null, nonLocalePath: `/${firstSegment}${restPath}`, queryFragment };
}

/**
 * Creates an Angular {@link UrlMatcher} that consumes a configured-locale segment from
 * the start of a route. When the first URL segment matches one of scConfig's `locales`, it is consumed
 * and exposed as the `locale` route param. Otherwise zero segments are consumed and the
 * route still matches (so error routes and the catchall handle both prefixed and unprefixed
 * URLs from the same route tree).
 * @param {string[]} locales - Configured locales.
 * @returns {UrlMatcher} Angular URL matcher for locale-prefixed route trees.
 * @public
 */
export function scLocaleMatcher(locales: string[]): UrlMatcher {
  return (segments: UrlSegment[]): UrlMatchResult => {
    if (segments.length > 0 && locales.includes(segments[0].path)) {
      return { consumed: [segments[0]], posParams: { locale: segments[0] } };
    }
    return { consumed: [] };
  };
}

/**
 * Resolves the initial URL pathname from the current execution environment.
 * Returns `'/'` when neither REQUEST nor `window.location` is available.
 * @param {Request | null} req - SSR REQUEST token value, when present.
 * @param {boolean} isBrowser - Whether the current platform is the browser.
 * @returns {string} URL pathname suitable for locale extraction.
 */
export function resolveCurrentPath(req: Request | null, isBrowser: boolean): string {
  if (req) {
    try {
      return new URL(req.url).pathname;
    } catch {
      // fall through to browser/default
    }
  }
  if (isBrowser && typeof window !== 'undefined' && window.location) {
    return window.location.pathname;
  }
  return '/';
}
