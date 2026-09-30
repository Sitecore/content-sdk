---
name: content-sdk-route-configuration
description: App Router catch-all at src/app/[site]/[locale]/[[...path]]/page.tsx; setRequestLocale required.
---

# Route configuration (App Router)

**Detail:** [AGENTS-router-specifics.md#routing-site--locale--path](../../docs/AGENTS-router-specifics.md#routing-site--locale--path)
**Read first:** `src/app/[site]/[locale]/[[...path]]/page.tsx`

## When

- Routing, layouts, placeholders
- setRequestLocale or catch-all changes

## Rules

- Single Sitecore page entry: `[site]/[locale]/[[...path]]/page.tsx`
- Call `setRequestLocale(`${site}_${locale}`)` at top of page
- Await `params` (Promise in Next.js 15+)

## Stop

- Stop if adding a second catch-all for Sitecore pages

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
