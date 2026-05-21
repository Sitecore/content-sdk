---
name: content-sdk-component-registration
description: Registers Sitecore components in the component map so layout and editing can resolve them. App Router uses .sitecore/component-map.ts (Server) and .sitecore/component-map.client.ts (Client). Use when registering a new component or when layout/editor cannot find a component.
---

# Content SDK Component Registration (App Router)

Register components in the Sitecore component maps so the layout and editing pipeline can resolve and render them. This app has **two** maps: server and client.

## When to Use

- After scaffolding or adding a new Sitecore component (must be registered).
- User reports a component not rendering, "component not found," or layout/placeholder showing raw component name.
- Task involves `.sitecore/component-map.ts` or `.sitecore/component-map.client.ts`.
- User asks how to register a component or fix component resolution.

## How to perform

- Open `.sitecore/component-map.ts` (Server) or `.sitecore/component-map.client.ts` (Client). Add an entry mapping the layout component name to the React component import. Keep keys consistent with layout and existing map entries.

## Hard Rules

- Every component rendered from Sitecore layout must be registered. Keep the maps in sync with `src/components/`.
- **Server components** (no `'use client'`): Register in `.sitecore/component-map.ts` only.
- **Client components** (`'use client'`): Register in `.sitecore/component-map.client.ts` only. Editing API routes use both maps (e.g. `clientComponents` from the client map).
- Use consistent component names (same key in map as used in layout). Follow existing naming in the maps.
- Do not remove or rename registrations without updating all references (layout, editing routes).

## Stop Conditions

- Stop if it is unclear whether the new component is Server or Client; ask or follow app convention.
- Stop if modifying the maps would break existing layout or editing; suggest a safe change or ask for confirmation.
- Do not edit `.sitecore/metadata.json` or import-map unless the task explicitly requires it.

## References

- [AGENTS.md](../../../AGENTS.md) for component maps and editing routes.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
