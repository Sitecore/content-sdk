---
'@sitecore-content-sdk/core': patch
---

Fix pnpm omitting Sitecore packages from `metadata.json`. List with `pnpm list --parseable --long` and parse bun and pnpm output with the same regex.
