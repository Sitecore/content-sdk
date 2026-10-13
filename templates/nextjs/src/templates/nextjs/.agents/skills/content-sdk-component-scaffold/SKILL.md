---
name: content-sdk-component-scaffold
description: Creates new Sitecore components under src/components/. Pages Router; map auto-regenerates on dev/build.
---

# Component scaffold (Pages Router)

**Detail:** [AGENTS-router-specifics.md#component-map-and-layout](../../docs/AGENTS-router-specifics.md#component-map-and-layout)
**Read first:** `src/components/`

## When

- Adding a new Sitecore component from scratch
- User asks for component file structure or props

## Rules

- Place components under `src/components/`
- Map regenerates during `npm run dev` / `npm run build`; run `npm run sitecore-tools:generate-map` if dev is not running

## Stop

- Stop if unclear whether component needs client-side interactivity

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
