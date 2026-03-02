---
name: content-sdk-component-scaffold
description: Creates new Sitecore components with correct file structure, props interface, and placement under src/components/. Use when adding a new component from scratch or scaffolding a component. App Router: decide Server vs Client and register in the appropriate map.
---

# Content SDK Component Scaffold (App Router)

Scaffold new Sitecore components so they integrate with the layout and editing pipeline. This app uses App Router with separate server and client component maps.

## When to Use

- User asks to add a new Sitecore component, create a component from scratch, or scaffold a component.
- Task involves creating a new React component that will be rendered from Sitecore layout/placeholders.
- User mentions "new component," "add component," or "component file structure."

## How to perform

- Create a new file under `src/components/` (or existing feature folder). Define props (fields, params), export a single default component.
- Decide Server vs Client: default Server; add `'use client'` only if the component needs hooks or event handlers.
- Register the component in the correct map (content-sdk-component-registration). Run `npm run build` to verify.

## Hard Rules

- Place components under `src/components/`. Use existing folder conventions.
- Define a props interface with the component's fields (e.g. `fields: { title: Field; ... }`) and any params. Use types from `@sitecore-content-sdk/react` or the app's types.
- Export a single default component; one component per file unless the app pattern differs.
- **Server vs Client:** Use Server Components by default. Add `'use client'` only for interactivity (hooks, event handlers). Register Server components in `.sitecore/component-map.ts`; Client components in `.sitecore/component-map.client.ts`.
- After creating the component file, register it in the correct component map (see content-sdk-component-registration). Do not leave the component unregistered.

## Stop Conditions

- Stop and ask if the component should be a Server or Client Component when the app does not have a clear convention.
- Do not create components in `.next/`, `node_modules/`, or build output.

## References

- [AGENTS.md](../../../AGENTS.md) for app structure and component maps.
- [Skills.md](../../../Skills.md) for capability map. [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
