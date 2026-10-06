---
'@sitecore-content-sdk/core': patch
---

Include required Sitecore peer dependencies in `.sitecore/metadata.json` when the package manager does not install them. Metadata records the same version npm would install, without adding those peers as direct dependencies.
