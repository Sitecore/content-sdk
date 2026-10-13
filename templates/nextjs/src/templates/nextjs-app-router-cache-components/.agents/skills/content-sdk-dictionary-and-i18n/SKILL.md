---
name: content-sdk-dictionary-and-i18n
description: next-intl with requestLocale = `${site}_${locale}`; routing.ts + request.ts.
---

# Dictionary and i18n (App Router + Cache Components)

**Detail:** [AGENTS-router-specifics.md#i18n-next-intl](../../docs/AGENTS-router-specifics.md#i18n-next-intl)

## When

- Locale, dictionary, or next-intl issues

## Rules

- `setRequestLocale(`${site}_${locale}`)` in page
- Parse `requestLocale` in `src/i18n/request.ts`
- Dictionary via `getSitecoreDictionary` in `src/i18n/request.ts`

## Stop

- Stop if changing `{site}_{locale}` convention without updating all callers

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
