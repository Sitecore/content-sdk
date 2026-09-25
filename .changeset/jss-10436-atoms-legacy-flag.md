---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/react': minor
---

[JSS-10436] Allow atoms to be marked as `legacy` so Design Studio can exclude them from new AI component generations

- Add an optional `legacy` flag to component definitions in `defineAtomsCatalog`
- Always emit `legacy` in the serialized catalog sent to Design Studio, defaulting to `false`
- The SDK does not act on the flag beyond serializing it
