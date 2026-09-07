---
name: content-sdk-component-registration
description: Registers components in .sitecore/component-map.ts and the SITECORE_COMPONENT_MAP token.
---

# Component registration (Angular)

**Detail:** [AGENTS-key-concepts.md#component-map](../../docs/AGENTS-key-concepts.md#component-map)
**Read first:** `.sitecore/component-map.ts`, `sitecore.cli.config.ts`

## When

- Component renders as "missing component" in layout or editor
- Task touches the component map or `componentMap.paths`

## Rules

- Every layout component must appear in `.sitecore/component-map.ts`, keyed by its Sitecore rendering name
- Prefer regeneration (`npm run sitecore-tools:generate-map`) over hand-editing; the generator scans `componentMap.paths` from `sitecore.cli.config.ts` for `@Component(` decorators
- The map is provided via `{ provide: SITECORE_COMPONENT_MAP, useValue: componentMap }` in `app.config.ts` and imported again in `server.ts` for the editing config middleware
- The built-in `['Form', ScFormComponent]` entry is emitted by the generator — do not remove it
- Components need a default export for the `{ ...Module }` spread to resolve

## Stop

- Stop if renaming map entries would break published layout without a matching Sitecore-side update

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
