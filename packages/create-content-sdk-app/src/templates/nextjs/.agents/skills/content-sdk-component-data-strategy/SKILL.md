---
name: content-sdk-component-data-strategy
description: Component data for Pages Router: after getPage use client.getComponentData(page.layout, context, components) to resolve component props; pass result to layout renderer. All Sitecore-driven component data goes through this flow. Use when wiring component data or BYOC.
---

# Content SDK Component Data Strategy (Pages Router)

This app **uses getComponentData**. After getPage, use **client.getComponentData(page.layout, context, components)** to resolve component props and pass the result to the layout renderer. All Sitecore-driven component data goes through this flow.

## When to Use

- User asks how to pass data to components, wire component props, or integrate custom/BYOC components.
- Task involves getComponentData, component props, or BYOC.
- User mentions "component data," "props," "BYOC," or "getComponentData."

## How to perform

- In [[...path]].tsx: getPage(path, { locale: context.locale }), then getDictionary, then getComponentData(page.layout, context, components). Return props to Layout; do not fetch in _app or in child components. Register BYOC in .sitecore/component-map.ts; getComponentData passes resolved props.

## Hard Rules

- **Flow in catch-all page:** In getStaticProps/getServerSideProps: (1) `client.getPage(path, { locale: context.locale })`, (2) `client.getDictionary({ site: page.siteName, locale: page.locale })`, (3) `client.getComponentData(page.layout, context, components)` to resolve component props. Return `{ props: { page, dictionary, componentProps }, notFound: !page }`. Pass these props to Providers and Layout; do not fetch Sitecore data in _app.
- Do not fetch per-component data in parallel outside this flow unless the app pattern explicitly does so. All Sitecore-driven component data goes through getComponentData.
- Single client instance; do not create a new client inside components. The client is used in getStaticProps/getServerSideProps and in API routes.
- **BYOC or custom components:** Must be registered in `.sitecore/component-map.ts` and receive props in the shape the layout expects (e.g. fields, params). getComponentData will pass the resolved props.
- Do not fetch layout or page data inside a child component (e.g. another getPage call); fetch at the catch-all page level and pass props via getComponentData and layout.

## Stop Conditions

- Stop if the user wants to fetch page/layout data inside a child component; recommend fetching in [[...path]].tsx and passing via getComponentData and layout.
- Do not duplicate getComponentData or getPage logic across components; keep data fetching in the catch-all page only.
- Do not fetch Sitecore data in _app; all data flows from [[...path]].tsx.

## References

- content-sdk-graphql-data-fetching and [AGENTS.md](../../../AGENTS.md) for getPage, getComponentData, and data flow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
