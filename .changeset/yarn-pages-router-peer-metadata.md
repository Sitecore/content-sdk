---
'create-content-sdk-app': patch
---

Add `@sitecore-content-sdk/personalize` to the Next.js Pages Router template dependencies. Yarn does not install missing peers, so a Pages Router app built with Yarn could not resolve the package and omitted it from `.sitecore/metadata.json`.
