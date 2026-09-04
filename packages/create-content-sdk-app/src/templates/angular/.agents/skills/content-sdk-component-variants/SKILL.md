---
name: content-sdk-component-variants
description: Multiple renderings of one component type via module exports; regenerate the component map after changes.
---

# Component variants (Angular)

**Detail:** [AGENTS-key-concepts.md#component-map](../../docs/AGENTS-key-concepts.md#component-map)
**Read first:** `.sitecore/component-map.ts`

## When

- One component type with multiple presentations or SXA variants

## Rules

- Export the default variant as the module default and each named variant as a named export from the same file — the map spreads the module (`{ ...Module }`)
- Follow existing patterns in `src/app/components/`
- Regenerate the map after changes (`npm run sitecore-tools:generate-map`)
- Variant selection comes from `rendering.params`; read it with `computed()` rather than branching in the template

## Stop

- Stop if a variant rename would break published layout without a Sitecore update

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
