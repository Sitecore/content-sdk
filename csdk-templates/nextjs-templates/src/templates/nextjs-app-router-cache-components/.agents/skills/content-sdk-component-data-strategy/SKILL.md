---
name: content-sdk-component-data-strategy
description: Cached layout data via cache helpers; preview via client; site/locale from params.
---

# Component data strategy (App Router + Cache Components)

**Detail:** [AGENTS-router-specifics.md#data-fetching-and-preview](../../docs/AGENTS-router-specifics.md#data-fetching-and-preview)

## When

- Component props / data flow
- BYOC registration

## Rules

- Non-preview reads: `getSitecorePage` / `getSitecoreDictionary` from `src/lib/cache/`
- Pass `{ site, locale }` from `await params`
- Client components get serializable props only

## Stop

- Stop if adding parallel fetch path

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
