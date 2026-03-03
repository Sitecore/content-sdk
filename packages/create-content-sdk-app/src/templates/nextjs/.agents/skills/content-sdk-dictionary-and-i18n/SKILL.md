---
name: content-sdk-dictionary-and-i18n
description: Dictionary and i18n for Pages Router: Next.js i18n in next.config.js (i18n.locales, defaultLocale). Per-request locale is context.locale in getStaticProps/getServerSideProps. Fetch dictionary with client.getDictionary({ site: page.siteName, locale: page.locale }) after getPage. Use when adding or changing translated content or locale behavior.
---

# Content SDK Dictionary and i18n (Pages Router)

This app uses **Next.js built-in i18n**. There is no [locale] in the URL path; locale is provided by Next.js as `context.locale` in getStaticProps/getServerSideProps.

## When to Use

- User asks to add or change translated content, locale, or dictionary.
- Task involves getDictionary, Next.js i18n, or context.locale.
- User mentions "dictionary," "i18n," "locale," or "translation."

## How to perform

- Locales: `next.config.js` → i18n.locales, defaultLocale. In getStaticProps/getServerSideProps use context.locale; after getPage use client.getDictionary({ site: page.siteName, locale: page.locale }). Use a single getDictionary per request. Do not assume locale from headers.

## Hard Rules

- **Config:** `next.config.js` → `i18n.locales` and `i18n.defaultLocale`. Match (or subset) Sitecore languages.
- **Per-request locale:** Use `context.locale` in getStaticProps and getServerSideProps. Pass it to `client.getPage(path, { locale: context.locale })`. After fetching the page, use `page.siteName` and `page.locale` (or `context.locale`) for `client.getDictionary({ site: page.siteName, locale: page.locale })` and for getComponentData.
- Align locales in next.config.js with Sitecore languages (e.g. from sitecore.config.ts defaultLanguage). Use a single client.getDictionary per request for the active site/locale.
- **Do not** assume locale from headers or a different source; always use `context.locale` and the page's site/locale for Sitecore calls.

## Stop Conditions

- Stop if adding a new locale without confirming it exists in Sitecore and in next.config.js i18n.
- Do not duplicate dictionary fetching without a clear need; prefer one fetch per request in the catch-all page.

## References

- [AGENTS.md](../../../AGENTS.md) for Next.js i18n and getDictionary usage.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
