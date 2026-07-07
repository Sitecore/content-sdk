---
name: content-sdk-multisite-management
description: Multisite via proxy.ts: PreviewProxy → BotTrackingProxy → MultisiteProxy → RedirectsProxy → PersonalizeProxy.
---

# Multisite management (Pages Router)

**Detail:** [AGENTS-router-specifics.md#multisite-and-edge-middleware-proxy](../../docs/AGENTS-router-specifics.md#multisite-and-edge-middleware-proxy)
**Read first:** `src/proxy.ts`, `.sitecore/sites.json`

## When

- Multisite routing, sites.json, or proxy changes

## Rules

- Proxy order fixed: Preview → BotTracking → Multisite → Redirects → Personalize
- Use `.sitecore/sites.json` in middleware and API routes
- Keep matcher excluding `/api`, `/_next`, static assets

## Stop

- Stop if changing proxy order without explicit approval

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
