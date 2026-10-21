---
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

Enable Turbopack support for the component props loader in the Next.js Pages Router template, so `getComponentServerProps` is stripped from client bundles. Also fix the loader's package export path and make the webpack rule work on all platforms.
