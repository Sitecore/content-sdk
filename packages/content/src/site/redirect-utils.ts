import { RedirectInfo } from '../site';
import {
  areURLSearchParamsEqual,
  escapeNonSpecialQuestionMarks,
  escapeRegExp,
  isRegexOrUrl,
  mergeURLSearchParams,
} from '@sitecore-content-sdk/core/tools';

const REGEXP_CONTEXT_SITE_LANG = /\$siteLang/i;
const REGEXP_ABSOLUTE_URL = /^(?:[a-z]+:)?\/\//i;

export type RedirectResult = RedirectInfo & {
  matchedQueryString?: string;
  matchedPath?: string;
};

export type ProcessedPath = {
  nonLocalePath: string;
  locale?: string;
  queryString?: string;
};

/**
 * Splits a URL path into its (optional) leading locale segment, the remaining
 * locale-less path, and the query string. Locales are compared case-insensitively.
 * @param {string[]} configuredLocales configured site locales
 * @param {string} urlPath path (optionally including a `?query`)
 * @returns {ProcessedPath} broken-down path parts
 */
export const breakDownPath = (configuredLocales: string[], urlPath: string): ProcessedPath => {
  const urlArray = urlPath.endsWith('/') ? urlPath.slice(0, -1).split('?') : urlPath.split('?');
  const urlQs = urlArray[1];
  const nonQsPath = urlArray[0];
  const pathArray = nonQsPath.startsWith('/')
    ? nonQsPath.slice(1).split('/')
    : nonQsPath.split('/');
  const [maybeLocale, maybeNonLocale] = [pathArray[0], pathArray.slice(1).join('/')];
  const lowerCaseMaybeLocale = maybeLocale.toLowerCase();
  // locales must be compared case insensitively, variations are abundant and typos can be there
  return configuredLocales.find(
    (configuredLocale) => configuredLocale.toLowerCase() === lowerCaseMaybeLocale
  )
    ? {
        nonLocalePath: `/${maybeNonLocale}`,
        queryString: urlQs,
        locale: maybeLocale,
      }
    : {
        nonLocalePath: nonQsPath,
        queryString: urlQs,
      };
};

/**
 * Matches redirect-map rules without a `locale` field against the incoming URL (static or regex patterns).
 * @param {RedirectResult[]} redirects All redirects from the service (non-locale entries are filtered inside).
 * @param {string[]} configuredLocales configured site locales
 * @param {string} urlLocale Locale segment from the request URL.
 * @param {string} incomingURL Original pathname used for regex tests.
 * @param {string} incomingQS Query string including leading `?` if present.
 * @returns {RedirectResult | undefined} First matching redirect or undefined.
 */
export const matchFromRedirectMapRedirect = (
  redirects: RedirectResult[],
  configuredLocales: string[],
  urlLocale: string,
  incomingURL: string,
  incomingQS: string
): RedirectResult | undefined => {
  const nonLocaleRedirects = redirects.filter((redirect: RedirectResult) => !redirect.locale);
  const normalizedPath = incomingURL.replace(/\/*$/gi, '').toLowerCase();
  const localePath = `/${urlLocale.toLowerCase()}${normalizedPath}`;

  return nonLocaleRedirects.find((redirect: RedirectResult) => {
    // process static URL (non-regex) rules
    if (isRegexOrUrl(redirect.pattern) === 'url') {
      const urlArray = redirect.pattern.endsWith('/')
        ? redirect.pattern.slice(0, -1).split('?')
        : redirect.pattern.split('?');
      const patternQS = urlArray[1];
      let patternPath = urlArray[0].toLowerCase();
      // nextjs routes are case-sensitive, but locales should be compared case-insensitively
      const patternParts = patternPath.split('/');
      const maybeLocale = (patternParts[1] || '').toLowerCase();
      // case insensitive lookup of locales
      if (configuredLocales.find((locale) => locale.toLowerCase() === maybeLocale)) {
        patternPath = patternPath.replace(`/${patternParts[1]}`, `/${maybeLocale}`);
      }

      return (
        (patternPath === localePath || patternPath === normalizedPath) &&
        (!patternQS ||
          areURLSearchParamsEqual(new URLSearchParams(patternQS), new URLSearchParams(incomingQS)))
      );
    }

    // process regex rules
    const regex = safeCompileRedirectPattern(redirect.pattern);
    if (!regex) {
      return false;
    }
    const testRegex = (value: string) => {
      regex.lastIndex = 0;
      return regex.test(value);
    };
    const pathCandidates = [
      incomingURL,
      normalizedPath,
      getLocaleStrippedPath(incomingURL, urlLocale),
      getLocaleStrippedPath(normalizedPath, urlLocale),
    ].filter((candidate, index, array) => array.indexOf(candidate) === index);
    const matchedPath = pathCandidates.find((candidate) => testRegex(candidate));
    const matchedPathWithQuery = incomingQS
      ? pathCandidates.find((candidate) => testRegex(`${candidate}${incomingQS}`))
      : undefined;

    // Save the matched path/query (if found) into the redirect object
    redirect.matchedQueryString = matchedPathWithQuery ? incomingQS : '';
    redirect.matchedPath = matchedPath || matchedPathWithQuery || '';

    return !!(matchedPath || matchedPathWithQuery);
  });
};

/**
 * Processes redirect rules from redirect items (language-versioned)
 * @param {RedirectResult[]} redirects redirect entries from Edge
 * @param {string} locale current request locale
 * @param {string} nonLocalePath current request path with locale prefix stripped
 * @returns {RedirectResult | undefined} matched redirect item redirect result or undefined
 */
export const matchRedirectItemRedirect = (
  redirects: RedirectResult[],
  locale: string,
  nonLocalePath: string
): RedirectResult | undefined => {
  return redirects.find((redirect: RedirectResult) => {
    const patternPath = redirect.pattern.replace(/\/*$/g, '').toLowerCase();
    // locale rules are easy and nice
    return redirect.locale === locale && patternPath === nonLocalePath;
  });
};

/**
 * Compiles a redirect pattern to RegExp; returns null if Sitecore produced a malformed rule
 * so one bad entry does not fail the entire redirect chain.
 * Supports both JS literal form (`/pattern/i`) and plain regex source (`^/path$`).
 * @param {string} pattern redirect pattern from redirect map
 * @returns {RegExp | null} normalized regex instance, or null when invalid
 */
export const safeCompileRedirectPattern = (pattern: string): RegExp | null => {
  try {
    const normalizedPattern = escapeNonSpecialQuestionMarks(pattern);
    const literalMatch = normalizedPattern.match(/^\/(.+)\/([a-z]*)$/i);
    if (literalMatch) {
      const [, source, flags] = literalMatch;
      const safeFlags = flags || 'i';
      return new RegExp(source, safeFlags);
    }
    return new RegExp(normalizedPattern, 'i');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[RedirectsProxy] Invalid redirect regex; skipping rule. pattern=${pattern} (${message})`
    );
    return null;
  }
};

/**
 * Strips locale prefix from path when present.
 * @param {string} path incoming request path
 * @param {string} urlLocale locale from the request URL
 * @returns {string} locale-stripped path
 */
export const getLocaleStrippedPath = (path: string, urlLocale: string): string => {
  if (!urlLocale) {
    return path;
  }
  const localePrefixRegex = new RegExp(`^/${escapeRegExp(urlLocale)}(?=/|$)`, 'i');
  const strippedPath = path.replace(localePrefixRegex, '') || '/';
  return strippedPath.startsWith('/') ? strippedPath : `/${strippedPath}`;
};

/**
 * Detects absolute (external or protocol-relative) target URLs.
 * @param {string} target redirect target
 * @returns {boolean} true when the target is an absolute URL
 */
export const isAbsoluteTarget = (target: string): boolean => REGEXP_ABSOLUTE_URL.test(target);

/**
 * Resolves the redirect target string: replaces the `$siteLang` token and applies
 * regex capture-group substitutions (`$1`, `$2`, …) when the rule pattern is a regex.
 * @param {RedirectResult} existsRedirect matched redirect
 * @param {string} siteLanguage site language used for the `$siteLang` token
 * @param {string} requestPath incoming request path, used when the rule stored no matched path
 * @returns {string} resolved target
 */
export const resolveRedirectTarget = (
  existsRedirect: RedirectResult,
  siteLanguage: string,
  requestPath: string
): string => {
  let target = existsRedirect.target.replace(REGEXP_CONTEXT_SITE_LANG, siteLanguage);

  // Apply regex replacements to the target URL if the pattern is a regex
  if (isRegexOrUrl(existsRedirect.pattern) === 'regex') {
    const sourcePath = existsRedirect.matchedPath || requestPath;
    const pathForCaptureMatch = sourcePath.replace(/\/*$/gi, '') || '/';
    const redirectRegex = safeCompileRedirectPattern(existsRedirect.pattern);
    const matched = redirectRegex ? pathForCaptureMatch.match(redirectRegex) : null;
    if (matched) {
      target = target.replace(
        /\$(\d+)/g,
        (_: string, index: string): string => matched[parseInt(index, 10)] || ''
      );
    }
  }

  return target;
};

export const processAbsoluteUrlTarget = (
  incomingPathData: ProcessedPath,
  existsRedirect: RedirectResult
): string => {
  if (!incomingPathData.queryString || !existsRedirect.isQueryStringPreserved) {
    return existsRedirect.target;
  }
  const [targetMainUrl, targetQS] = existsRedirect.target.split('?');
  const mergedQueryString = mergeURLSearchParams(
    new URLSearchParams(incomingPathData.queryString),
    new URLSearchParams(targetQS || '')
  );
  return `${targetMainUrl}?${mergedQueryString}`;
};

/**
 * Resolves the locale-less path and target locale for a relative redirect URL.
 * The framework layer is responsible for placing the locale (pathname vs. locale property).
 * @param {ProcessedPath} incomingPathData broken-down incoming request path
 * @param {RedirectResult} existsRedirect matched redirect
 * @param {string[]} configuredLocales configured site locales
 * @param {string} reqLocale current request locale (used when `isLanguagePreserved`)
 * @returns {{ targetLocale: string; targetPath: string }} resolved locale and locale-less path (with query)
 */
export const processRelativeUrlTarget = (
  incomingPathData: ProcessedPath,
  existsRedirect: RedirectResult,
  configuredLocales: string[],
  reqLocale: string
): { targetLocale: string; targetPath: string } => {
  const { locale, nonLocalePath, queryString } = breakDownPath(
    configuredLocales,
    existsRedirect.target
  );
  // preserve the request locale when the target has no locale prefix and the rule opts in
  const targetLocale = locale || (existsRedirect.isLanguagePreserved ? reqLocale : '');

  const targetQS =
    incomingPathData.queryString && existsRedirect.isQueryStringPreserved
      ? mergeURLSearchParams(
          new URLSearchParams(incomingPathData.queryString),
          new URLSearchParams(queryString || '')
        )
      : queryString || '';

  return {
    targetLocale,
    targetPath: `${nonLocalePath}${targetQS ? '?' + targetQS : ''}`,
  };
};

