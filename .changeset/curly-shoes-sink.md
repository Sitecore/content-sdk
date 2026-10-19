---
'@sitecore-content-sdk/nextjs': patch
---

Fix App Router redirect-map rules not matching locale-prefixed paths. `RedirectsProxy` now removes the request locale from the path before matching, so a rule like `^/page$` matches `/page`, `/en/page` and `/da/page`, even when that locale isn't listed in `redirects.locales`. A target locale taken from a regex capture keeps its configured casing (for example `en-CA`).
