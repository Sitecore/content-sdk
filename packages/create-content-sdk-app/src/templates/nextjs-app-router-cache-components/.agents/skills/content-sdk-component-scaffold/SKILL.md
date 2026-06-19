---
name: content-sdk-component-scaffold
description: Creates new Sitecore components with correct file structure, props interface, and placement under src/components/. Use when adding a new component from scratch or scaffolding a component. App Router: decide Server vs Client and register in the appropriate map.
---

# Content SDK Component Scaffold (App Router + Cache Components)

Scaffold new Sitecore components so they integrate with the layout and editing pipeline. This app uses App Router with separate server and client component maps. Component data still flows from the cached page read (`getSitecorePage`); component code itself usually does not change because of Cache Components.

## When to Use

- User asks to add a new Sitecore component, create a component from scratch, or scaffold a component.
- Task involves creating a new React component that will be rendered from Sitecore layout/placeholders.
- User mentions "new component," "add component," or "component file structure."

## How to perform

- Create a new file under `src/components/` (or existing feature folder). Define props (fields, params), export a single default component.
- Decide Server vs Client: default Server; add `'use client'` only for hooks or event handlers.
- **Map:** Regenerates automatically during `npm run dev` and `npm run build`; otherwise run `npm run sitecore-tools:generate-map` (see content-sdk-component-registration).
- Run `npm run build` to verify.

## Hard Rules

- Place components under `src/components/`. Use existing folder conventions.
- Prefer `sitecore-tools:generate-map` to regenerate the component maps instead of hand-editing them. Only manually register the component if the generator cannot handle the change.
- Define a props interface with the component's fields (e.g. `fields: { title: Field; ... }`) and any params. Use types from `@sitecore-content-sdk/react` or the app's types.
- Export a single default component; one component per file unless the app pattern differs.
- **Server vs Client:** Use Server Components by default. Add `'use client'` only for interactivity (hooks, event handlers). The generator places Server components in `.sitecore/component-map.ts` and Client components in `.sitecore/component-map.client.ts`.
- Do not fetch Sitecore data inside the component (no `getSitecorePage` / `client.getPage` calls). Component data comes from the cached page read at the page level.
- Ensure the component appears in the correct map after regeneration (or update the map manually only if the generator cannot handle the case) before considering the task complete (see content-sdk-component-registration).

## Stop Conditions

- Stop and ask if the component should be a Server or Client Component when the app does not have a clear convention.
- Do not create components in `.next/`, `node_modules/`, or build output.

## References

- [AGENTS.md](../../../AGENTS.md) for app structure and component maps.
- [Skills.md](../../../Skills.md) for capability map. [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
