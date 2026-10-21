---
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

Strip `getComponentServerProps` from client bundles in the Next.js Pages Router template. The loader export now points at the published files, and the template registers it for Turbopack and webpack on client builds only. Existing apps need the same `next.config.js` changes.
