---
name: content-sdk-component-data-strategy
description: Component data for App Router: layout from getPage (or preview handlers in editing). Pass site and locale from route params; Server Components fetch with the client; Client Components get serializable props. BYOC must be registered in the component map. Use when wiring component data.
---

# Component data (App Router)

**Detail:** [AGENTS.md](../../../AGENTS.md); **content-sdk-graphql-data-fetching**.

## When

- Passing props from page/layout to components, BYOC, or RSC vs client boundaries.

## Rules

- Fetch Sitecore layout/page data in Server Components / page; pass serializable props to client children.
- BYOC must be registered in the correct map; do not re-fetch layout in client components unless the app already does.

## Stop

- Reject patterns that duplicate `getPage` across many client components for the same request.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
