---
'create-content-sdk-app': patch
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/react': patch
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/cli': patch
'@sitecore-content-sdk/angular': patch
---

Support FEaaS components when Next.js Cache Components is enabled. Set `componentMap.cacheComponents: true` in `sitecore.cli.config.ts` and `generate-map` registers `FEaaSCacheComponentsServerWrapper`, which renders FEaaS at request time behind Suspense while the rest of the page stays cached. The Cache Components template sets this flag. Existing Cache Components apps should add it on upgrade. The built-in `FEaaSServerWrapper` is unchanged.
