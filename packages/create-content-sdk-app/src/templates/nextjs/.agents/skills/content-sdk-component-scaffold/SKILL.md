---
name: content-sdk-component-scaffold
description: Creates new Sitecore components with correct file structure, props interface, and placement under src/components/. Use when adding a new component from scratch or scaffolding a component. Pages Router: register in .sitecore/component-map.ts only.
---

# Content SDK Component Scaffold (Pages Router)

Scaffold new Sitecore components so they integrate with the layout and editing pipeline. This app uses Pages Router with a single component map.

## When to Use

- User asks to add a new Sitecore component, create a component from scratch, or scaffold a component.
- Task involves creating a new React component that will be rendered from Sitecore layout/placeholders.
- User mentions "new component," "add component," or "component file structure."

## How to perform

- Create a new file under `src/components/` (or existing feature folder). Define props (fields, params), export a single default component. Register in `.sitecore/component-map.ts` (content-sdk-component-registration). Run `npm run build` to verify.

## Hard Rules

- Place components under `src/components/`. Use existing folder conventions.
- Define a props interface with the component's fields (e.g. `fields: { title: Field; ... }`) and any params. Use types from `@sitecore-content-sdk/react` or the app's types.
- Export a single default component; one component per file unless the app pattern differs.
- After creating the component file, register it in `.sitecore/component-map.ts` (see content-sdk-component-registration). Do not leave the component unregistered. Pages Router has a single map used by getComponentData and editing API routes.

## Stop Conditions

- Do not create components in `.next/`, `node_modules/`, or build output.

## References

- [AGENTS.md](../../../AGENTS.md) for app structure and component map.
- [Skills.md](../../../Skills.md) for capability map. [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
