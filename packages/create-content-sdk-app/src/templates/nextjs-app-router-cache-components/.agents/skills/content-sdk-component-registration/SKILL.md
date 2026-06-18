---
name: content-sdk-component-registration
description: Registers Sitecore components in the component map so layout and editing can resolve them. App Router uses .sitecore/component-map.ts (Server) and .sitecore/component-map.client.ts (Client). Use when registering a new component or when layout/editor cannot find a component.
---

# Content SDK Component Registration (App Router + Cache Components)

Register components in the Sitecore component maps so the layout and editing pipeline can resolve and render them. This app has **two** maps: server and client. The maps are independent of Cache Components — they describe how the layout pipeline resolves component names.

## When to Use

- After scaffolding or adding a new Sitecore component (must be registered).
- User reports a component not rendering, "component not found," or layout/placeholder showing raw component name.
- Task involves `.sitecore/component-map.ts` or `.sitecore/component-map.client.ts`.
- User asks how to register a component or fix component resolution.

## How to perform

- `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts` are generated from `src/components/` during `npm run dev` (watch) and `npm run build`, with each component routed to the correct map based on `'use client'`.
- Use `npm run sitecore-tools:generate-map` or `npm run sitecore-tools:generate-map:watch` when you need to refresh the maps outside the normal dev or build flow.
- Edit the map files directly only when the generator cannot express your scenario; otherwise keep them generated so server and client registrations stay aligned.

## Hard Rules

- Every component rendered from Sitecore layout must be registered. Prefer the project's `sitecore-tools:generate-map` script to keep the maps in sync with `src/components/`. Do not hand-edit generated map entries unless necessary.
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
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
