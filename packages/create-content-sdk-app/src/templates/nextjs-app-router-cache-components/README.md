# Sitecore Content SDK — Next.js App Router + Cache Components

This starter matches the default **nextjs-app-router** template, with **Next.js Cache Components** (`cacheComponents`), **`getSitecorePage`**, **`getSitecoreDictionary`**, and **`getSitecoreErrorPage`** (Sitecore 404) helpers that apply Sitecore cache tags for tag-based on-demand revalidation, plus a single **`POST /api/revalidate`** route that accepts explicit cache tags or Sitecore webhook-style payloads. From the app root you can call that URL with standard HTTP tooling (see `docs/tag-based-revalidation.md` and the monorepo **`docs/tag-based-revalidation.md`** for the full walkthrough).

Use the **`nextjs-app-router`** template if you do not need Cache Components or tag revalidation wiring.

[SitecoreAI Content SDK Documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
