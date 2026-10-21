---
name: content-sdk-sitemap-robots
description: Route handlers under src/app/api/ with createSitemapRouteHandler / createRobotsRouteHandler / createLlmsTxtRouteHandler.
---

# Sitemap, robots and llms.txt (App Router)

**Detail:** [AGENTS-router-specifics.md#api-route-handlers](../../docs/AGENTS-router-specifics.md#api-route-handlers)

## When

- Sitemap, robots, or llms.txt handlers

## Rules

- `createSitemapRouteHandler` / `createRobotsRouteHandler` / `createLlmsTxtRouteHandler` with `sites` from `.sitecore/sites.json`
- Rewrites in `next.config.ts` for `/sitemap*.xml`, `/robots.txt`, `/llms.txt`
- llms.txt content is managed via Sitecore AI configuration; Content SDK only consumes/serves it (no authoring UX, no content generation)

## Stop

- Stop if hardcoding site list

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
