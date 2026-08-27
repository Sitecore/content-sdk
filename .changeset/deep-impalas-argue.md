---
'@sitecore-content-sdk/angular': minor
---

Design Studio support:
 - Adds a `design-library` component
 - Adds `library` and `library-medatada` modes support - preview existing and codegenerated components. 
 - Implementation hangs on `import-map` (generated at build time) and a component factory to render components at runtime.
 - `DESIGN_LIBRARY_IMPORT_MAP` injections token provides a Promise to lazy load import map. `DESIGN_LIBRARY_COMPONENT_FACTORY` injection token provides the factory and allows overriding it.