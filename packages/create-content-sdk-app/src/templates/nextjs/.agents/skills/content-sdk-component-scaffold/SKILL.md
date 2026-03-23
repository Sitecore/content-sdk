---
name: content-sdk-component-scaffold
description: Creates new Sitecore components with correct file structure, props interface, and placement under src/components/. Use when adding a new component from scratch or scaffolding a component. Pages Router: register in .sitecore/component-map.ts only.
---

# Component scaffold (Pages Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Application Structure, component map, Layout.

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
