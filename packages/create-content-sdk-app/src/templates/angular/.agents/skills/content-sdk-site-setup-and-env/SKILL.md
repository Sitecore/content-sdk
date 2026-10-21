---
name: content-sdk-site-setup-and-env
description: sitecore.config.ts and the CSDK_PUBLIC_ browser/server env split; document in .env.example only.
---

# Site setup and env (Angular)

**Detail:** [AGENTS-key-concepts.md#environment-and-config](../../docs/AGENTS-key-concepts.md#environment-and-config)
**Read first:** `sitecore.config.ts`, `.env.example`, `scripts/generate-environment.ts`

## When

- Configuring site, API, or environment variables
- Adding a new environment variable

## Rules

- Browser-safe values must be named `CSDK_PUBLIC_*` — `scripts/generate-environment.ts` copies only those into `src/environments/environment.{dev,prod}.ts`
- Server secrets (`SITECORE_EDITING_SECRET`, `SITECORE_REVALIDATE_SECRET`, `SITECORE_EDGE_CONTEXT_ID`, `SITECORE_API_KEY`) stay in `process.env`; never give them a `CSDK_PUBLIC_` name
- `process.env` does not exist in the browser — that is why the generated environment files exist; do not read `process.env` from `src/app/**`
- `sitecore.config.ts` is `defineConfig({}, environment)`. **Non-secret structural settings go in the first argument** (`angular.locales`, `angular.loadersCache`, `angular.linkPrefetch`, `multisite`, `redirects`, `personalize`); the app ships `{}` there. Endpoints, keys and secrets come from env via the second argument and `process.env` — never as literals
- `scConfig.*` is the **resolved, read-only** result of `defineConfig`. Change configuration by editing `sitecore.config.ts`, never by assigning to `scConfig` at runtime
- Document every new variable in `.env.example` with a placeholder; never commit `.env`
- Regenerate env files with `npm run gen:env:dev` / `gen:env:prod`; never hand-edit `environment.dev.ts` / `environment.prod.ts`

## Stop

- Stop if asked to commit secrets, hardcode API keys, or expose a server secret through a `CSDK_PUBLIC_` variable

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
