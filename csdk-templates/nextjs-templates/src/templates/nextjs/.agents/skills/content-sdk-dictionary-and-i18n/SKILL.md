---
name: content-sdk-dictionary-and-i18n
description: Next.js i18n via next.config.js; locale from context.locale in data methods.
---

# Dictionary and i18n (Pages Router)

**Detail:** [AGENTS-router-specifics.md#i18n-pages-router](../../docs/AGENTS-router-specifics.md#i18n-pages-router)

## When

- i18n locales, dictionary, or context.locale issues

## Rules

- `next.config.js` → `i18n.locales` / `defaultLocale` aligned with Sitecore
- Always pass `context.locale` to `client.getPage`

## Stop

- Stop if assuming locale from headers instead of `context.locale`

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
