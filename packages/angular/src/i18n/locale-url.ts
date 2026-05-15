import type { Params } from '@angular/router';

/**
 * Strips a leading locale segment from a URL path (query string preserved).
 * @param {string} url - Full URL or path (may include `?query`)
 * @param {string[]} locales - Known locale codes
 * @returns {string} Path with optional first-segment locale removed
 * @public
 */
export function stripLocalePrefix(url: string, locales: readonly string[]): string {
  const qIndex = url.indexOf('?');
  const path = qIndex >= 0 ? url.slice(0, qIndex) : url;
  const query = qIndex >= 0 ? url.slice(qIndex) : '';
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    const rest = segments.slice(1).join('/');
    const canonical = rest ? `/${rest}` : '/';
    return canonical + query;
  }
  return url;
}

/**
 * Resolves the active locale from route params and default language.
 * @param {Params | Record<string, string | undefined> | undefined} params - Merged route params (may include `locale`)
 * @param {string} defaultLanguage - Fallback when no locale param
 * @returns {string} Effective locale code
 * @public
 */
export function resolveLocale(
  params: Params | Record<string, string | string[] | undefined> | undefined,
  defaultLanguage: string
): string {
  const raw = (params as { locale?: string | string[] } | undefined)?.locale;
  if (typeof raw === 'string' && raw.length > 0) {
    return raw;
  }
  return defaultLanguage;
}

/**
 * Prefixes a path with a locale segment when the locale is not the default.
 * @param {string} path - Canonical path (e.g. `/about`, `/404`)
 * @param {string} locale - Active locale
 * @param {string} defaultLanguage - Default language (no prefix when equal)
 * @returns {string} Prefixed or unchanged path
 * @public
 */
export function prependLocale(path: string, locale: string, defaultLanguage: string): string {
  if (locale === defaultLanguage) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

/**
 * Strips a configured not-found/error route if it was mistakenly prefixed with a locale.
 * @param {string} routePath - Configured route (e.g. `/404` or `/en/404`)
 * @param {string[]} locales - Known locale codes
 * @returns {string} Canonical unprefixed path starting with `/`
 */
export function stripConfiguredRouteLocalePrefix(
  routePath: string,
  locales: readonly string[]
): string {
  const trimmed = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return stripLocalePrefix(trimmed, locales);
}

/**
 * Extracts locale from the first URL path segment when it matches `locales`.
 * @param {string} url - Full URL or path
 * @param {string[]} locales - Known locale codes
 * @param {string} defaultLanguage - Used when no locale prefix is present
 * @returns {string} Detected locale
 * @public
 */
export function extractLocaleFromUrl(
  url: string,
  locales: readonly string[],
  defaultLanguage: string
): string {
  const path = url.split('?')[0];
  const first = path.split('/').filter(Boolean)[0];
  if (first && locales.includes(first)) {
    return first;
  }
  return defaultLanguage;
}

/**
 * Returns the path without a leading locale segment for comparison (no leading slash).
 * @param {string} path - Normalized path without leading slash (e.g. `fr/about`)
 * @param {string[]} locales - Known locale codes
 * @returns {string} Path with optional first locale segment removed
 */
export function stripLeadingLocaleFromPathKey(
  path: string,
  locales: readonly string[]
): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 0 && locales.includes(parts[0])) {
    return parts.slice(1).join('/');
  }
  return path;
}
