---
'create-content-sdk-app': patch
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/react': patch
---

Support FEaaS components when Next.js Cache Components is enabled. `FEaaSCacheComponentsServerWrapper` renders FEaaS at request time behind Suspense, and `createFEaaSCacheComponentsServerWrapper` lets an app cache published components. The Cache Components template registers the new wrapper. Existing Cache Components apps must add `src/components/FEaaSWrapper.tsx` on upgrade. The built-in `FEaaSServerWrapper` is unchanged.
