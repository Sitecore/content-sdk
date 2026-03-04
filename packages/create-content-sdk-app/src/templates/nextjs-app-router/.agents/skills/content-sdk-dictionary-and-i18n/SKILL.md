---
name: content-sdk-dictionary-and-i18n
description: Dictionary and i18n for App Router: next-intl with src/i18n/routing.ts and request.ts. Request locale is site_locale; call setRequestLocale in the page; in request.ts parse and load dictionary with client.getDictionary. Use when adding or changing translated content or locale behavior.
---

# Content SDK Dictionary and i18n (App Router)

This app uses **next-intl**. Locale is in the URL as [locale]. Request locale is encoded as `${site}_${locale}` for next-intl.

## When to Use

- User asks to add or change translated content, locale, or dictionary.
- Task involves getDictionary, next-intl, or locale in URL/request.
- User mentions "dictionary," "i18n," "locale," "translation," or "next-intl."

## How to perform

- Locales and routing: `src/i18n/routing.ts`. Request config: `src/i18n/request.ts` — parse `requestLocale` (e.g. `${site}_${locale}`), call `client.getDictionary({ locale, site })`, return `{ locale, messages }`. In the page, call `setRequestLocale(\`${site}_${locale}\`)` at the top. Use a single getDictionary per request.

## Hard Rules

- **Config:** `src/i18n/routing.ts` — `defineRouting({ locales, defaultLocale, localePrefix })`. Align `locales` with Sitecore languages (e.g. from sitecore.config.ts defaultLanguage).
- **Request config:** `src/i18n/request.ts` — `getRequestConfig` receives `requestLocale`. This app uses `${site}_${locale}` (set by `setRequestLocale(\`${site}_${locale}\`)` in the page). Parse requestLocale (e.g. `split('_')`) to get site and locale; load dictionary with `client.getDictionary({ locale, site })` and return `{ locale, messages }`.
- **In the page:** Call `setRequestLocale(\`${site}_${locale}\`)` at the **top** of the page so next-intl and request config see the correct locale. Do not omit when adding new page branches.
- **Do not** change the `${site}_${locale}` convention without updating request.ts and all pages that call setRequestLocale.
- Use a single client.getDictionary per request for the active site/locale. Never assume locale from headers or global state; use route params (site, locale).

## Stop Conditions

- Stop if the user wants to change to a different encoding for requestLocale; this affects request.ts and all setRequestLocale call sites.
- Stop if adding a new locale without confirming it exists in Sitecore and in routing.ts.
- Do not duplicate dictionary fetching (e.g. in layout and page) without a clear need.

## References

- [AGENTS.md](../../../AGENTS.md) for next-intl, setRequestLocale, and getDictionary usage.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
