---
name: content-sdk-component-data-strategy
description: Layout data from getPage/getComponentData; path/locale from extractPath/context.
---

# Component data strategy (Pages Router)

**Detail:** [AGENTS-router-specifics.md#routing-and-data-fetching](../../docs/AGENTS-router-specifics.md#routing-and-data-fetching)

## When

- How component receives Sitecore data
- BYOC or serializable props to client

## Rules

- Data from `getPage` + `getComponentData` in catch-all page
- Pass serializable props to client components
- BYOC must be registered in component map

## Stop

- Stop if introducing a second data-fetch path without clear need

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
