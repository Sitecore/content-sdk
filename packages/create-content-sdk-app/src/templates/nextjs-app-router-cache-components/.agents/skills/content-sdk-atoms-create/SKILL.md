---
name: content-sdk-atoms-create
description: Creates atoms via defineAtomsCatalog and defineAtomsRegistry — props, field schemas, slots, actions.
---

# Atoms create (App Router + Cache Components)

**Read first:** `src/atoms/index.tsx`
**Related:** `content-sdk-atoms-setup`, `content-sdk-atoms-maintain`

## When

- Adding or editing atom components / actions in the catalog and registry
- Choosing Zod props or Sitecore field schemas for atom props

## Rules

- Define schema with `defineAtomsCatalog` and React implementations with `defineAtomsRegistry` (import from `@sitecore-content-sdk/nextjs/atoms`)
- Catalog needs `components` and `actions` (use `actions: {}` when none); export the catalog as **`catalog`**
- Per component: `props` (Zod), `description`, optional `slots`, `allowedChildren` / `allowedParents`, optional `version`
- Registry component names must match catalog names; each renderer gets `{ props, children, emit, on, bindings }`
- If catalog defines actions, map matching handlers under registry `actions`
- Sitecore fields: prefer `textFieldSchema`, `richTextFieldSchema`, `linkFieldSchema`, `imageFieldSchema`, `dateFieldSchema`, `fileFieldSchema` — do not invent parallel field shapes
- **Do not** put `className` in catalog props (type-enforced); wrapper styling uses rendering `params.styles` / `params.RenderingIdentifier`, not catalog schema
- Keep registry as a Client Component surface (`'use client'` via `defineAtomsRegistry`)
- Do **not** add atoms to `.sitecore/component-map*` — Provider `atomsConfig` is the registration path
- After intentional schema changes, run `npm run sitecore-tools:atoms:update` (see maintain skill)

## Stop

- Stop if setup wiring is missing → `content-sdk-atoms-setup`
- Stop if the change is only version/lock drift → `content-sdk-atoms-maintain`
- Stop if the user wants a normal Sitecore rendering under `src/components/` → `content-sdk-component-scaffold`
