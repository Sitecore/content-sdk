---
name: content-sdk-component-data-strategy
description: Component data for App Router: layout data from getPage (or getPreview/getDesignLibraryData in editing). No getComponentData; pass site and locale from route params. Server Components use the client in server context; Client Components receive serializable props. Use when wiring component data or BYOC.
---

# Content SDK Component Data Strategy (App Router)

This app does **not** use getComponentData. Page and layout data come from **getPage** (or getPreview/getDesignLibraryData in editing). Component props are derived from the layout/placeholders; pass site and locale from route params.

## When to Use

- User asks how to pass data to components, wire component props, or integrate custom/BYOC components.
- Task involves component props, server vs client components, or BYOC.
- User mentions "component data," "props," "BYOC," "server component," or "client component."

## How to perform

- Fetch at page/layout with getPage (or getPreview/getDesignLibraryData in draft). Pass site and locale from route params. Server Components use the client in server context; Client Components receive serializable props only. Register BYOC in the correct component map and pass props from layout.

## Hard Rules

- **Data source:** Page and layout from `client.getPage(path ?? [], { site, locale })` in the catch-all page (or getPreview/getDesignLibraryData when draftMode() is enabled). All Sitecore-driven data flows from this single fetch at the route level.
- **Server Components:** Use the same SitecoreClient in server context (e.g. in the page or layout). Pass data as props to children.
- **Client Components:** Receive **serializable** props from parent (no functions or non-serializable values). Do not create a new client inside components. Pass data from page/layout level into components.
- **BYOC or custom components:** Must be registered in the appropriate component map (.sitecore/component-map.ts or component-map.client.ts) and receive props in the shape the layout expects (e.g. fields, params).
- Do not fetch layout or page data inside a child component (e.g. another getPage call); fetch at page/layout level and pass props.

## Stop Conditions

- Stop if the user wants to fetch page/layout data inside a child component; recommend fetching at page/layout level and passing props.
- Stop if server/client boundary is ambiguous and the change could cause "use client" or serialization issues; clarify and follow Next.js and app conventions.
- Do not introduce getComponentData or duplicate getPage logic; this app uses getPage-only data flow.

## References

- content-sdk-graphql-data-fetching and [AGENTS.md](../../../AGENTS.md) for getPage and data flow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
