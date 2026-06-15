---
name: content-sdk-dictionary-and-i18n
description: Dictionary and i18n for App Router + Cache Components: next-intl with src/i18n/routing.ts and request.ts. Request locale is site_locale; call setRequestLocale in the page; in request.ts parse and load dictionary with getSitecoreDictionary (cached, tag-aware). Use when adding or changing translated content or locale behavior.
---

# Content SDK Dictionary and i18n (App Router + Cache Components)

This app uses **next-intl**. Locale is in the URL as [locale]. Request locale is encoded as `${site}_${locale}` for next-intl. Dictionary reads go through `getSitecoreDictionary` (Cache Components helper) so dictionary updates can be invalidated by webhook via the `sc:dict:{site}:{locale}` tag.

## When to Use

- User asks to add or change translated content, locale, or dictionary.
- Task involves getSitecoreDictionary, next-intl, or locale in URL/request.
- User mentions "dictionary," "i18n," "locale," "translation," or "next-intl."

## How to perform

- Locales and routing: `src/i18n/routing.ts`. Request config: `src/i18n/request.ts` — parse `requestLocale` (e.g. `${site}_${locale}`), call `getSitecoreDictionary({ locale, site })` from `src/lib/cache/get-sitecore-dictionary.ts`, return `{ locale, messages }`. In the page, call `setRequestLocale(\`${site}_${locale}\`)` at the top.

## Hard Rules

- **Config:** `src/i18n/routing.ts` — `defineRouting({ locales, defaultLocale, localePrefix })`. Align `locales` with Sitecore languages (e.g. from sitecore.config.ts defaultLanguage).
- **Request config:** `src/i18n/request.ts` — `getRequestConfig` receives `requestLocale`. This app uses `${site}_${locale}` (set by `setRequestLocale(\`${site}_${locale}\`)` in the page). Parse requestLocale (e.g. `split('_')`) to get site and locale; load dictionary with **`getSitecoreDictionary({ locale, site })`** (the cache-aware helper) and return `{ locale, messages }`. **Do not** call `client.getDictionary` directly here — that bypasses the `sc:dict` cache tag.
- **In the page:** Call `setRequestLocale(\`${site}_${locale}\`)` at the **top** of the page so next-intl and request config see the correct locale. Do not omit when adding new page branches.
- **Do not** change the `${site}_${locale}` convention without updating request.ts and all pages that call setRequestLocale.
- **SDK dictionary cache must stay disabled** in `sitecore.config.ts` (`dictionary: { caching: { enabled: false } }`). The Cache Components helper is the only dictionary cache layer; otherwise `revalidateTag` cannot invalidate dictionary data.
- Use a single `getSitecoreDictionary` per request for the active site/locale. Never assume locale from headers or global state; use route params (site, locale).

## Stop Conditions

- Stop if the user wants to change to a different encoding for requestLocale; this affects request.ts and all setRequestLocale call sites.
- Stop if adding a new locale without confirming it exists in Sitecore and in routing.ts.
- Stop if the user wants to bypass `getSitecoreDictionary` (e.g. call `client.getDictionary` directly) or re-enable the SDK dictionary cache; explain it breaks tag-based dictionary invalidation.
- Do not duplicate dictionary fetching (e.g. in layout and page) without a clear need.

## References

- [AGENTS.md](../../../AGENTS.md) for next-intl, setRequestLocale, and getSitecoreDictionary usage.
- content-sdk-cache-components-and-osr for the `sc:dict` tag and revalidation flow.
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
