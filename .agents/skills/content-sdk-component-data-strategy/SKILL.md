---
name: content-sdk-component-data-strategy
description: Defines how component data is fetched and passed: BYOC (Bring Your Own Component), server/client component props, and wiring component-specific data. Use when wiring component data or integrating custom components.
---

# Content SDK Component Data Strategy

Component data flows from layout to components via getComponentData (Pages) or server/client props (App); BYOC and custom components must align with this flow.

## When to Use

- User asks how to pass data to components, wire component props, or integrate custom/BYOC components.
- Task involves getComponentData, component props, server vs client components, or BYOC.
- User mentions "component data," "props," "BYOC," "server component," or "client component."

## Hard Rules

- **Pages Router:** After getPage, use client.getComponentData(page.layout, context, components) to resolve component props; pass result to layout renderer. All Sitecore-driven component data goes through this; do not fetch per-component data in parallel outside this flow unless the app pattern explicitly does so.
- **App Router:** Page and layout data from getPage (or getPreview/getDesignLibraryData in editing). Component props are typically derived from layout/placeholders; pass site and locale from route params. For Server Components use the same client in server context; for Client Components receive serializable props from parent.
- Single client instance; do not create a new client inside components. Pass data from page/layout level into components.
- BYOC or custom components must be registered in the component map and receive props in the same shape the layout expects (e.g. fields, params). Document any custom prop shape in the app or component.

## Stop Conditions

- Stop if the user wants to fetch layout or page data inside a child component (e.g. another getPage call); recommend fetching at page/layout level and passing props.
- Stop if server/client boundary is ambiguous (App Router) and the change could cause "use client" or serialization issues; clarify and follow Next.js and app conventions.
- Do not duplicate getComponentData or getPage logic across components; keep data fetching at the route/layout level.

## References

- content-sdk-graphql-data-fetching and template AGENTS.md for getPage, getComponentData, and data flow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
