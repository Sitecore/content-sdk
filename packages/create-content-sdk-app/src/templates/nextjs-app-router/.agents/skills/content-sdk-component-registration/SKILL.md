---
name: content-sdk-component-registration
description: Registers Sitecore components in .sitecore/component-map.ts (Server) and .sitecore/component-map.client.ts (Client). Required for layout and editing. App Router uses separate server and client maps. Use when registering a new component or when layout/editor cannot find a component.
---

# Component registration (App Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#component-maps-and-layout), [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#api-route-handlers).

**Read code first:** `.sitecore/component-map.ts`, `.sitecore/component-map.client.ts`.

## When

- Missing component in editor/layout, or task touches server/client maps.

## Rules

- Server components → `.sitecore/component-map.ts`; interactive/client → `.sitecore/component-map.client.ts` when required by editing.
- Keep map keys aligned with layout names and with `createEditingConfigRouteHandler` wiring.

## Stop

- Escalate if renaming entries would break published layout without a Sitecore-side update.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
