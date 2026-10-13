---
name: content-sdk-component-scaffold
description: Creates Sitecore components under src/components/. App Router; server/client maps auto-regenerate.
---

# Component scaffold (App Router)

**Detail:** [AGENTS-router-specifics.md#component-maps-and-layout](../../docs/AGENTS-router-specifics.md#component-maps-and-layout)
**Read first:** `src/components/`

## When

- Adding a new Sitecore component
- Choosing Server vs Client (`use client`)

## Rules

- Place under `src/components/`
- Server → server map; Client → client map (generator picks by `use client`)
- Run `npm run sitecore-tools:generate-map` if dev is not running

## Stop

- Stop if unclear Server vs Client — follow app convention

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
