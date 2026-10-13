---
name: content-sdk-dictionary-and-i18n
description: URL locale segments via scLocaleMatcher; locale in loaders via getLanguage and splitLocaleFromPath.
---

# Dictionary and i18n (Angular)

**Detail:** [AGENTS-angular-specifics.md#i18n-and-dictionary](../../docs/AGENTS-angular-specifics.md#i18n-and-dictionary)
**Read first:** `sitecore.config.ts`, `src/app/app.routes.ts`, `src/content-sdk/loaders/dictionary.loader.ts`

## When

- Locale, dictionary, or translation issues
- Adding a supported language

## Rules

- Locales are URL segments (`/en/about`). **To add one, edit `sitecore.config.ts`** and pass it in the **first argument** of `defineConfig` — the app ships an empty `{}` there:

  ```ts
  export default defineConfig({ angular: { locales: ['en', 'fr-FR'] } }, environment);
  ```

- `scConfig.angular.locales` is the **resolved read path** consumed by `scLocaleMatcher` and `splitLocaleFromPath` — never assign to it at runtime
- `defaultLanguage` is prepended to the list automatically when missing, and `redirects.locales` is derived from `angular.locales` — keep `angular.locales` as the single source of truth
- `defaultLanguage` itself comes from env (`CSDK_PUBLIC_SITECORE_DEFAULT_LANGUAGE` / `SITECORE_DEFAULT_LANGUAGE`), not from a literal in `sitecore.config.ts`; keep it aligned with Sitecore
- In loaders: locale from `getLanguage(context)` (fall back to `scConfig.defaultLanguage`), item path from `splitLocaleFromPath(context.url, scConfig.angular.locales).nonLocalePath`
- Never send a locale-prefixed path to `getPage`
- Dictionary comes from `dictionaryLoader` → route data `dictionary` → `SitecoreContextService.dictionary()`; `SitecoreTranslateLoader` bridges it to `@ngx-translate/core`
- Page content is translated by Sitecore language versions, not by a client-side translation library
- Let `LocaleUrlSerializer` and `*scLink` / `*scRouterLink` handle locale prefixes in links

## Stop

- Stop if assuming locale from headers or a cookie instead of the route param
- Stop if adding a parallel translation source for page content

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
