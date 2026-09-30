---
name: content-sdk-sitemap-robots
description: API routes src/pages/api/sitemap.ts, robots.ts and llms-txt.ts with SDK middleware.
---

# Sitemap, robots and llms.txt (Pages Router)

**Detail:** [AGENTS-router-specifics.md#api-routes](../../docs/AGENTS-router-specifics.md#api-routes)

## When

- Sitemap, robots.txt, llms.txt, or other SEO/well-known-file route handlers

## Rules

- Use `SitemapMiddleware` / `RobotsMiddleware` / `LlmsTxtMiddleware` with `sites` from `.sitecore/sites.json`
- Add rewrites in `next.config.js` for public URLs (`/sitemap*.xml`, `/robots.txt`, `/llms.txt`)
- llms.txt content is managed via Sitecore AI configuration; Content SDK only consumes/serves it (no authoring UX, no content generation)

## Stop

- Stop if hardcoding site list instead of `.sitecore/sites.json`

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
