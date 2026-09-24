---
'@sitecore-content-sdk/personalize': patch
---

Document the token-enabled Personalize flow output (`variantId` plus a flat `tokens` map of strings or finite numbers). `personalize()` still returns `unknown`; hosts validate the runtime shape. This package does not depend on `@sitecore-content-sdk/content`, so it needs its own changeset to publish.
