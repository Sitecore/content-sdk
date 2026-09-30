---
name: content-sdk-sitemap-robots
description: Sitemap and robots Express middleware in src/server.ts with sites from .sitecore/sites.json.
---

# Sitemap and robots (Angular)

**Detail:** [AGENTS-angular-specifics.md#express-server-and-middleware-order](../../docs/AGENTS-angular-specifics.md#express-server-and-middleware-order)
**Read first:** `src/server.ts`

## When

- Sitemap, robots.txt, or other SEO / well-known file handlers

## Rules

- Use `createSitemapMiddleware({ client: getClient(), sites })` mounted at `/sitemap.xml` and `/sitemap-:id.xml`, and `createRobotsMiddleware({ client: getClient(), sites })` at `/robots.txt`
- `sites` comes from `.sitecore/sites.json` — never hardcode the site list
- Register these before `express.static` and the SSR handler
- These are plain Express routes; there is no rewrite layer to keep in sync (unlike the Next.js templates)

## Stop

- Stop if hardcoding the site list instead of using `.sitecore/sites.json`

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
