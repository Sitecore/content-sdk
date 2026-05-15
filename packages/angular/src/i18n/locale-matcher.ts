import { Route, UrlMatchResult, UrlMatcher, UrlSegment, UrlSegmentGroup } from '@angular/router';

/**
 * Consumes an optional leading locale segment.
 * `/en/foo/bar` → `posParams.locale` = `en`; `/foo/bar` → no locale param (default language).
 * @param {string[]} locales - Known locale codes for the first segment
 * @returns {UrlMatcher} Angular URL matcher
 * @public
 */
export function createLocaleMatcher(locales: readonly string[]): UrlMatcher {
  return (segments: UrlSegment[], group: UrlSegmentGroup, route: Route): UrlMatchResult | null => {
    void group;
    void route;
    if (segments.length === 0) {
      return { consumed: [], posParams: {} };
    }
    if (locales.includes(segments[0].path)) {
      return {
        consumed: segments,
        posParams: { locale: segments[0] },
      };
    }
    return {
      consumed: segments,
      posParams: {},
    };
  };
}

/**
 * Matches locale-aware error routes (`/404`, `/500`, `/fr/404`, …).
 * @param {string[]} locales - Known locale codes
 * @param {string} errorPath - Path segment for the error page (`404` or `500`)
 * @returns {UrlMatcher | null} Matcher that returns `null` when the URL is not this error route
 * @public
 */
export function createLocaleErrorMatcher(
  locales: readonly string[],
  errorPath: string
): UrlMatcher {
  return (segments: UrlSegment[], group: UrlSegmentGroup, route: Route): UrlMatchResult | null => {
    void group;
    void route;
    if (segments.length === 1 && segments[0].path === errorPath) {
      return { consumed: segments, posParams: {} };
    }
    if (
      segments.length === 2 &&
      locales.includes(segments[0].path) &&
      segments[1].path === errorPath
    ) {
      return {
        consumed: segments,
        posParams: { locale: segments[0] },
      };
    }
    return null;
  };
}
