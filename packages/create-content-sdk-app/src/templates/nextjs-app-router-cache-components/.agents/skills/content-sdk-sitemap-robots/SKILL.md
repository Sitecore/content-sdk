---
name: content-sdk-sitemap-robots
description: Route handlers under src/app/api/ with createSitemapRouteHandler / createRobotsRouteHandler.
---

# Sitemap and robots (App Router + Cache Components)

**Detail:** [AGENTS-router-specifics.md#api-route-handlers](../../docs/AGENTS-router-specifics.md#api-route-handlers)

## When

- Sitemap or robots handlers

## Rules

- `createSitemapRouteHandler` / `createRobotsRouteHandler` with `sites` from `.sitecore/sites.json`
- Rewrites in `next.config.ts` for `/sitemap*.xml`, `/robots.txt`

## Stop

- Stop if hardcoding site list

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
