---
name: content-sdk-component-registration
description: Registers Sitecore components in .sitecore/component-map.ts so layout and editing can resolve them. Pages Router uses a single map; used by getComponentData and editing API routes. Use when registering a new component or when layout/editor cannot find a component.
---

# Component registration (Pages Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#component-map-and-layout), [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#api-routes).

**Read code first:** `.sitecore/component-map.ts`, `src/lib/component-props/index.ts`.

## When

- Component missing in editor/layout, or task touches `.sitecore/component-map.ts`.

## Rules

- Every layout component must have a map entry; keys must match layout names.
- Map is consumed by `getComponentData` and `src/pages/api/editing/*`; keep it aligned with `src/components/`.
- Do not rename/remove entries without updating layout and editing consumers.

## Stop

- Escalate if changing the map would break published layout without a coordinated Sitecore change.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
