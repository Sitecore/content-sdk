---
name: content-sdk-component-scaffold
description: Creates new Sitecore components with correct file structure, props interface, and placement under src/components/. Use when adding a new component from scratch. App Router: register server components in .sitecore/component-map.ts and client components in .sitecore/component-map.client.ts as appropriate.
---

# Component scaffold (App Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Server vs Client, component maps.

## When

- New Sitecore-driven component; need to choose Server vs Client and registration targets.

## Rules

- Default Server Component; `'use client'` only when hooks/events require it.
- Register in `.sitecore/component-map.ts` and/or `.sitecore/component-map.client.ts` per existing patterns.
- Run `npm run build` to verify.

## Stop

- Do not scaffold under `.next/`, `node_modules/`, or build output.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
