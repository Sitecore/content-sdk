---
name: content-sdk-component-data-strategy
description: Component data for App Router + Cache Components: layout data from getSitecorePage (or client.getPreview / getDesignLibraryData in draft). Pass site and locale from route params. Server Components use the cache helpers; Client Components receive serializable props. Use when wiring component data or BYOC.
---

# Content SDK Component Data Strategy (App Router + Cache Components)

This app does **not** use getComponentData. Page and layout data come from the cached helper **getSitecorePage** (or `client.getPreview` / `client.getDesignLibraryData` in editing). Component props are derived from the layout/placeholders; pass site and locale from route params.

## When to Use

- User asks how to pass data to components, wire component props, or integrate custom/BYOC components.
- Task involves component props, server vs client components, or BYOC.
- User mentions "component data," "props," "BYOC," "server component," or "client component."

## How to perform

- Fetch at page/layout with `getSitecorePage` (cached) or `client.getPreview` / `client.getDesignLibraryData` (dynamic preview). Pass site and locale from route params. Server Components use the cache helpers in server context; Client Components receive serializable props only. Register BYOC in the correct component map and pass props from layout.

## Hard Rules

- **Data source (cached):** Non-preview page / layout from `getSitecorePage({ site, locale, path: path ?? [] })` in the catch-all page. All Sitecore-driven data flows from this single fetch at the route level.
- **Data source (preview):** When `draftMode().isEnabled`, fetch via `client.getPreview` / `client.getDesignLibraryData` directly (not the cache helper). Both branches feed the same `Layout` component.
- **Server Components:** Use the cache helpers / SDK client in server context (e.g. in the page or layout). Pass data as props to children.
- **Client Components:** Receive **serializable** props from parent (no functions or non-serializable values). Do not create a new client inside components or call cache helpers from a Client Component. Pass data from page/layout level into components.
- **BYOC or custom components:** Must be registered in the appropriate component map (.sitecore/component-map.ts or component-map.client.ts) and receive props in the shape the layout expects (e.g. fields, params).
- Do not fetch layout or page data inside a child component (e.g. another `getSitecorePage` call); fetch at page/layout level and pass props. Duplicate fetches still hit the same cache entry, but they hide data flow and complicate invalidation.

## Stop Conditions

- Stop if the user wants to fetch page/layout data inside a child component; recommend fetching at page/layout level and passing props.
- Stop if server/client boundary is ambiguous and the change could cause "use client" or serialization issues; clarify and follow Next.js and app conventions.
- Do not introduce getComponentData or duplicate getSitecorePage logic; this app uses getSitecorePage-only data flow for non-preview reads.

## References

- content-sdk-graphql-data-fetching and [AGENTS.md](../../../AGENTS.md) for the cache helpers and data flow.
- content-sdk-cache-components-and-osr for tag strategy and revalidation.
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
