---
name: content-sdk-component-registration
description: Registers Sitecore components in .sitecore/component-map.ts so layout and editing can resolve them. Pages Router uses a single map; used by getComponentData and editing API routes. Use when registering a new component or when layout/editor cannot find a component.
---

# Content SDK Component Registration (Pages Router)

Register components in the Sitecore component map so the layout and editing pipeline can resolve and render them. This app has a **single** map: `.sitecore/component-map.ts`.

## When to Use

- After scaffolding or adding a new Sitecore component (must be registered).
- User reports a component not rendering, "component not found," or layout/placeholder showing raw component name.
- Task involves `.sitecore/component-map.ts`.
- User asks how to register a component or fix component resolution.

## How to perform

- The component map at `.sitecore/component-map.ts` is generated from `src/components/` during `npm run dev` or `npm run build`; run `npm run sitecore-tools:generate-map` to refresh it manually, and edit the file only when the generator cannot handle your case.

## Hard Rules

- Every component rendered from Sitecore layout must be registered in `.sitecore/component-map.ts`. Prefer the project's `sitecore-tools:generate-map` script to keep the map in sync with `src/components/`. Do not hand-edit generated map entries unless necessary.
- The map is used by `getComponentData(page.layout, context, components)` in the catch-all page and by editing API routes (`src/pages/api/editing/config.ts`, `render.ts`, `feaas/render.ts`).
- Use consistent component names (same key in map as used in layout). Follow existing naming in the map.
- Do not remove or rename registrations without updating all references (layout, getComponentData, editing routes).

## Stop Conditions

- Stop if modifying the component map would break existing layout or editing; suggest a safe change or ask for confirmation.
- Do not edit `.sitecore/metadata.json` or import-map unless the task explicitly requires it.

## References

- [AGENTS.md](../../../AGENTS.md) for component map and editing routes.
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
