---
'@sitecore-content-sdk/core': patch
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/react': patch
'@sitecore-content-sdk/nextjs': patch
'create-content-sdk-app': patch
---

[Atoms] Add the `designLibrary.atoms` capability and expose the serialized atoms catalog (version, styling solution, components and actions) through `.sitecore/metadata.json`. Capability `metadata` can now be a resolver function that receives the capability filter context, and the new `appInputs` option of `generateMetadata`, `getMetadata` and `calculateCapabilities` passes app-specific data (such as the catalog) to filters and resolvers. Adds `ATOMS_CATALOG_METADATA_KEY`, an `unrepresentable` option for `serializeCatalog` so schemas without a JSON Schema equivalent no longer break metadata generation, and updates the starter `sitecore.cli.config.ts` templates to pass the atoms catalog to `generateMetadata`.
