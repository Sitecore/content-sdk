---
name: content-sdk-upgrade-assistant
description: Upgrade @sitecore-content-sdk/* and Angular packages; check CHANGELOG and migration guides.
---

# Upgrade assistant (Angular)

**Detail:** [AGENTS-angular-specifics.md#config-files](../../docs/AGENTS-angular-specifics.md#config-files)
**Read first:** `package.json`

## When

- Bumping `@sitecore-content-sdk/angular`, `@sitecore-content-sdk/cli`, or Angular versions
- Migrating from an older SDK

## Rules

- Check the Content SDK CHANGELOG and upgrade guides before changing versions
- `@sitecore-content-sdk/angular` and `@sitecore-content-sdk/cli` move together with the Angular major — bump them as a set
- Use `ng update` for Angular packages so schematics run
- After upgrading, regenerate artifacts: `npm run gen:env:dev`, `npm run sitecore-tools:generate-map`, `npm run sitecore-tools:build`
- Verify with `npm run build`, `npm run lint`, and an SSR smoke test (`npm start`) covering both a full page load and a client-side navigation
- Re-check the loader API surface (`LoaderFn`, `LoaderContext`, `loaderResolver`, `createLoaderDataServiceMiddleware`)

## Stop

- Stop if the upgrade requires undocumented breaking env or config changes without user confirmation

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
