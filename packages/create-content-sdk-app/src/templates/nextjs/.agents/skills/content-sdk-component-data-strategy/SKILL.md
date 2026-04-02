---
name: content-sdk-component-data-strategy
description: Component data for Pages Router: after getPage use client.getComponentData(page.layout, context, components) to resolve component props; pass result to layout renderer. All Sitecore-driven component data goes through this flow. Use when wiring component data or BYOC.
---

# Component data (Pages Router)

**Detail:** [AGENTS-key-concepts.md](../../docs/AGENTS-key-concepts.md#catch-all-route); **content-sdk-graphql-data-fetching**.

**Read code first:** `src/pages/[[...path]].tsx`, `.sitecore/component-map.ts`.

## When

- Wiring props to layout/components, BYOC, or bypassing `getComponentData`.

## Rules

- In the catch-all only: `getPage` → `getDictionary` → `getComponentData`; pass results to `Layout`/`Providers`.
- BYOC/custom components must be in `.sitecore/component-map.ts` and receive layout-driven props from `getComponentData`.
- No extra `getPage` calls inside leaf components.

## Stop

- Reject moving Sitecore fetching into `_app` or arbitrary child components.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
