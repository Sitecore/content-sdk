---
'@sitecore-content-sdk/react': patch
---

Fix `DateField` hydration errors in Page Builder. In editing mode, `DateField` now always renders an element (default `span`), so a missing `tag` no longer breaks hydration and stops `EditingScripts` from running.
