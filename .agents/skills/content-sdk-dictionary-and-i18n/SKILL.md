---
name: content-sdk-dictionary-and-i18n
description: Handles dictionary and internationalization: dictionary fetching, next-intl (App Router) or Next.js i18n (Pages Router), and locale handling. Use when adding or changing translated content, locale behavior, or dictionary phrases.
---

# Content SDK Dictionary and i18n

Dictionary fetching and locale handling; App Router uses next-intl and requestLocale as site_locale; Pages Router uses Next.js i18n and context.locale.

## When to Use

- User asks to add or change translated content, locale, or dictionary.
- Task involves getDictionary, next-intl, Next.js i18n, or locale in URL/context.
- User mentions "dictionary," "i18n," "locale," "translation," or "next-intl."

## Hard Rules

- **App Router:** Locale in URL as [locale]. Use next-intl: src/i18n/routing.ts (locales, defaultLocale, localePrefix) and src/i18n/request.ts. Request locale is encoded as `${site}_${locale}`; in page call setRequestLocale(`${site}_${locale}`). In request.ts parse requestLocale (e.g. split('_')) to get site and locale; load dictionary with client.getDictionary({ locale, site }). Do not change the site_locale convention without updating request.ts and all pages that set request locale.
- **Pages Router:** Next.js i18n (next.config.js: i18n.locales, defaultLocale). Per-request locale is context.locale in getStaticProps/getServerSideProps. Fetch dictionary with client.getDictionary({ site: page.siteName, locale: page.locale }) after getPage.
- Align locales in app config with Sitecore languages (e.g. from sitecore.config.ts defaultLanguage). Use a single client.getDictionary per request for the active site/locale.
- Never assume locale from headers or global state in server code; use route params (App) or context.locale (Pages).

## Stop Conditions

- Stop if the app uses site_locale (App Router) and the user wants to change to a different encoding; this affects request.ts and all setRequestLocale call sites.
- Stop if adding a new locale without confirming it exists in Sitecore and in config (routing.ts or next.config.js).
- Do not duplicate dictionary fetching (e.g. in layout and page) without a clear need; prefer one fetch per request.

## References

- Template AGENTS.md for next-intl vs Next.js i18n, setRequestLocale, and getDictionary usage.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
