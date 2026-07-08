---
name: content-sdk-component-registration
description: Registers components in .sitecore/component-map.ts for Pages Router layout and editing.
---

# Component registration (Pages Router)

**Detail:** [AGENTS-router-specifics.md#component-map-and-layout](../../docs/AGENTS-router-specifics.md#component-map-and-layout)
**Read first:** `.sitecore/component-map.ts`

## When

- Component not found in layout/editor
- Task touches the component map

## Rules

- Every layout component must be in `.sitecore/component-map.ts`
- Prefer auto-generation from `src/components/`; edit manually only when generator cannot handle the case

## Stop

- Stop if renaming map entries would break published layout without Sitecore-side update

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
