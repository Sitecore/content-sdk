---
name: content-sdk-component-registration
description: Registers components in .sitecore/component-map.ts and component-map.client.ts for App Router.
---

# Component registration (App Router)

**Detail:** [AGENTS-router-specifics.md#component-maps-and-layout](../../docs/AGENTS-router-specifics.md#component-maps-and-layout)
**Read first:** `.sitecore/component-map.ts`, `.sitecore/component-map.client.ts`

## When

- Component missing in editor/layout
- Task touches component maps

## Rules

- Server components → `.sitecore/component-map.ts`
- Client components → `.sitecore/component-map.client.ts`
- Prefer auto-generation; manual edits only when generator cannot handle the case

## Stop

- Stop if renaming map keys would break published layout

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
