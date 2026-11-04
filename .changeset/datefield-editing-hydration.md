---
'@sitecore-content-sdk/react': patch
---

Fix `DateField` hydration errors in Page Builder. In editing mode, `DateField` now always renders an element (default `span`), so a missing `tag` no longer causes a structural hydration mismatch.
