---
name: content-sdk-component-data-strategy
description: Layout from getPage; site/locale from route params; serializable client props.
---

# Component data strategy (App Router)

**Detail:** [AGENTS-router-specifics.md#data-fetching-and-preview](../../docs/AGENTS-router-specifics.md#data-fetching-and-preview)

## When

- Component props / data flow
- BYOC registration

## Rules

- `getSitecorePageForRequest(path ?? [], site, locale)` in page Server Components (do not omit `tokens` on published renders)
- Pass `{ site, locale }` from `await params`
- Client components get serializable props only

## Stop

- Stop if adding parallel fetch path

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
