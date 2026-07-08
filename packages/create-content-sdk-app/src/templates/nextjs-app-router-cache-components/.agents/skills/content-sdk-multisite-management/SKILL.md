---
name: content-sdk-multisite-management
description: Proxy: PreviewProxy → BotTracking → Locale → Multisite → Redirects → Personalize.
---

# Multisite management (App Router + Cache Components)

**Detail:** [AGENTS-router-specifics.md#multisite-and-edge-middleware-proxy](../../docs/AGENTS-router-specifics.md#multisite-and-edge-middleware-proxy)
**Read first:** `src/proxy.ts`, `.sitecore/sites.json`

## When

- Multisite, sites.json, proxy matcher

## Rules

- Order: Preview → BotTracking → Locale → Multisite → Redirects → Personalize
- `.sitecore/sites.json` from CLI `generateSites`
- Do not change proxy order

## Stop

- Stop if changing proxy order

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
