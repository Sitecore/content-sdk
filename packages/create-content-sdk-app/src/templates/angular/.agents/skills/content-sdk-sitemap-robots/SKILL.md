---
name: content-sdk-sitemap-robots
description: Sitemap, robots and llms.txt Express middleware in src/server.ts with sites from .sitecore/sites.json.
---

# Sitemap, robots and llms.txt (Angular)

**Detail:** [AGENTS-angular-specifics.md#express-server-and-middleware-order](../../docs/AGENTS-angular-specifics.md#express-server-and-middleware-order)
**Read first:** `src/server.ts`

## When

- Sitemap, robots.txt, llms.txt, or other SEO / well-known file handlers

## Rules

- Use `createSitemapMiddleware({ client: getClient(), sites })` mounted at `/sitemap.xml` and `/sitemap-:id.xml`, `createRobotsMiddleware({ client: getClient(), sites })` at `/robots.txt`, and `createLlmsTxtMiddleware({ client: getClient(), sites })` at `/llms.txt`
- llms.txt content is managed via SitecoreAI configuration; Content SDK only consumes/serves it. A site without llms.txt content gets a `404` with a minimal default llms.txt
- `sites` comes from `.sitecore/sites.json` — never hardcode the site list
- Register these before `express.static` and the SSR handler
- These are plain Express routes; there is no rewrite layer to keep in sync (unlike the Next.js templates)

## Stop

- Stop if hardcoding the site list instead of using `.sitecore/sites.json`

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
