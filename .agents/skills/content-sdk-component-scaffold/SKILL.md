---
name: content-sdk-component-scaffold
description: Creates new Sitecore components with correct file structure, props interface, and placement under src/components/. Use when adding a new component from scratch, scaffolding a component, or creating a new React component for Sitecore layout.
---

# Content SDK Component Scaffold

Scaffold new Sitecore components so they integrate with the layout and editing pipeline.

## When to Use

- User asks to add a new Sitecore component, create a component from scratch, or scaffold a component.
- Task involves creating a new React component that will be rendered from Sitecore layout/placeholders.
- User mentions "new component," "add component," or "component file structure."

## Hard Rules

- Place components under `src/components/` (or the app's components directory). Use existing folder conventions (e.g. by feature or flat).
- Define a props interface that includes the component's fields (e.g. `fields: { title: Field; ... }`) and any params. Use types from `@sitecore-content-sdk/react` or the app's types.
- Export a single default component; keep the file focused (one component per file unless the app pattern differs).
- After creating the component file, register the component in the component map (see content-sdk-component-registration). Do not leave the component unregistered.
- In monorepo: edit only under `packages/create-content-sdk-app/src/templates/**` or `packages/react`/`packages/nextjs` as appropriate; in head apps, edit only app code under `src/`.

## Stop Conditions

- Stop and ask if the component should be a Server or Client Component (App Router) and the app does not have a clear convention.
- Stop and ask if the target is the monorepo templates vs a scaffolded head application; do not assume.
- Do not create components in `dist/`, `node_modules/`, or build output directories.

## References

- [AGENTS.md](../../../AGENTS.md) (monorepo or app) for package vs app scope and commands.
- [Skills.md](../../../Skills.md) for capability map. [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) for APIs.
