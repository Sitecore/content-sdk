---
name: content-sdk-sitemap-robots
description: API routes src/pages/api/sitemap.ts and robots.ts with SDK middleware.
---

# Sitemap and robots (Pages Router)

**Detail:** [AGENTS-router-specifics.md#api-routes](../../docs/AGENTS-router-specifics.md#api-routes)

## When

- Sitemap, robots.txt, or SEO route handlers

## Rules

- Use `SitemapMiddleware` / `RobotsMiddleware` with `sites` from `.sitecore/sites.json`
- Add rewrites in `next.config.js` for public URLs

## Stop

- Stop if hardcoding site list instead of `.sitecore/sites.json`

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
