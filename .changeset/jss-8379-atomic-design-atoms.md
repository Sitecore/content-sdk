---
'@sitecore-content-sdk/react': minor
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': minor
'@sitecore-content-sdk/cli': minor
'@sitecore-content-sdk/core': patch
'create-content-sdk-app': patch
---

Introduce Atoms — the Atomic Design foundation for building low-code components with Design Studio.

- Add `defineAtomsCatalog` and `defineAtomsRegistry` for Zod-based atom catalogs with component composition constraints, actions, and optional versioning
- Add Sitecore field schemas (`textFieldSchema`, `linkFieldSchema`, `imageFieldSchema`, and others) and `withPropMeta` for type-safe atom props and Design Studio field binding support
- Add `atomsConfig` on `SitecoreProvider` for passing catalog, registry, and navigation into the runtime
- Support Design Studio low-code preview with live layout, field, and rendering param updates
- Expose the atom catalog during Design Studio code-generation preview
- Render low-code components from Layout Service data when a rendering includes a `ComponentRef` parameter, applying `Styles` and `RenderingIdentifier` rendering params
- Pass Sitecore fields and rendering params from layout data into low-code components at render time
- Disallow `className` as a catalog prop
- Add atom version locking via `.sitecore/atoms.lock.json` with `sitecore-tools project atoms validate` and `sitecore-tools project atoms update`, integrated into the build pipeline
- Scaffold new Next.js apps with a starter `src/atoms/` setup and build-time atom validation
