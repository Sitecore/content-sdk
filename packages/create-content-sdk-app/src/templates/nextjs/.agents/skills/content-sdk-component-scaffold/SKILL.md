---
name: content-sdk-component-scaffold
description: Creates new Sitecore components with correct file structure, props interface, and placement under src/components/. Use when adding a new component from scratch or scaffolding a component. Pages Router: register in .sitecore/component-map.ts only.
---

# Component scaffold (Pages Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#component-map-and-layout), [AGENTS-workflows-and-boundaries.md](../../docs/AGENTS-workflows-and-boundaries.md#example-agent-tasks).

**Read code first:** `.sitecore/component-map.ts`, `src/lib/component-props/index.ts`, and one existing component under `src/components/` (e.g. `content-sdk`) before loading long prose.

## When

- New Sitecore-driven React component or scaffold request.
- Component will render from layout/placeholders.

## Rules

- Put files under `src/components/`; default export; typed props (`Field`, etc.).
- Register every new component in `.sitecore/component-map.ts` before considering the task done.
- Run `npm run build` to verify.

## Stop

- Do not add components under `.next/`, `node_modules/`, or build output.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
