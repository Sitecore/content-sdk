---
name: content-sdk-dictionary-and-i18n
description: Dictionary and i18n for Pages Router: Next.js i18n in next.config.js (i18n.locales, defaultLocale). Per-request locale is context.locale in getStaticProps/getServerSideProps. Fetch dictionary with client.getDictionary({ site: page.siteName, locale: page.locale }) after getPage. Use when adding or changing translated content or locale behavior.
---

# Dictionary & i18n (Pages Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — i18n (Pages Router), SitecoreClient.

## When

- Locales, dictionary phrases, or `getDictionary`.

## Rules

- Align `next.config.js` `i18n.locales` with Sitecore languages.
- Use `context.locale` for `getPage` and downstream `getDictionary` / `getComponentData` (no ad-hoc header locale).

## Stop

- Do not add a locale that is not configured in both Next and Sitecore without explicit confirmation.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
