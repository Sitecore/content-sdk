import { inject } from '@angular/core';
import { UrlMatchResult, UrlSegment, UrlMatcher } from '@angular/router';
import { I18N_CONFIG } from './i18n-config.token';

/**
 * Creates a URL matcher for language-aware routing.
 *
 * This matcher works similarly to Next.js language resolution:
 * - If the URL starts with a registered language code (e.g., /en/about), it matches and extracts the language as `lang` param.
 * - If the URL does not start with a language code (e.g., /about), it matches and uses the default language.
 *
 * The `lang` parameter is available in route params for use in resolvers and components.
 *
 * Uses Angular dependency injection to get language configuration from `I18N_CONFIG` token.
 * Configure via `provideSitecoreContentSdk({ i18n: { supportedLanguages, defaultLanguage } })`.
 * @returns An Angular UrlMatcher function
 * @example
 * ```typescript
 * // app.config.ts
 * provideSitecoreContentSdk({
 *   componentMap,
 *   i18n: {
 *     supportedLanguages: ['en', 'de', 'fr'],
 *     defaultLanguage: 'en',
 *   },
 * })
 * ```
 * @example
 * ```typescript
 * // app.routes.ts
 * import { languageMatcher, loaderResolver } from '@sitecore-content-sdk/angular';
 *
 * export const routes: Routes = [
 *   {
 *     matcher: languageMatcher(),
 *     component: ShellComponent,
 *     resolve: { dictionary: loaderResolver('dictionary') },
 *     children: [...]
 *   }
 * ];
 * ```
 * @example
 * ```typescript
 * // In loader - params.lang will be available
 * import { getLanguageFromParams } from '@sitecore-content-sdk/angular';
 *
 * const dictionaryLoader: LoaderFn = async ({ params }) => {
 *   const locale = getLanguageFromParams(params, 'en');
 *   // ...
 * };
 * ```
 * @public
 */
export function languageMatcher(): UrlMatcher {
  return (segments: UrlSegment[]): UrlMatchResult | null => {
    // Inject i18n config - this works because Angular invokes matchers in injection context
    const config = inject(I18N_CONFIG);
    const { supportedLanguages } = config;

    // Empty path - use default language
    if (segments.length === 0) {
      return {
        consumed: [],
        posParams: {},
      };
    }

    const firstSegment = segments[0].path;

    // Check if first segment is a supported language
    if (supportedLanguages.includes(firstSegment)) {
      // Language segment found - consume it and set lang param
      return {
        consumed: [segments[0]],
        posParams: {
          lang: segments[0],
        },
      };
    }

    // No language segment - match but don't consume any segments
    // The default language will be used
    return {
      consumed: [],
      posParams: {},
    };
  };
}

/**
 * Extracts the language from route params or returns the default language.
 * @param {Record<string, string | undefined>} params - Route parameters object (from LoaderContext.params or ActivatedRoute.params)
 * @param {string} defaultLanguage - Fallback language if no lang param is found
 * @returns {string} The resolved language code
 * @example
 * ```typescript
 * const dictionaryLoader: LoaderFn = async ({ params }) => {
 *   const locale = getLanguageFromParams(params, 'en');
 *   return client.getDictionary({ site: config.defaultSite, locale });
 * };
 * ```
 * @public
 */
export function getLanguageFromParams(
  params: Record<string, string | undefined>,
  defaultLanguage: string
): string {
  return params.lang || defaultLanguage;
}

// Re-export config types for convenience
export type { I18nConfig } from './i18n-config.token';
export { I18N_CONFIG } from './i18n-config.token';
