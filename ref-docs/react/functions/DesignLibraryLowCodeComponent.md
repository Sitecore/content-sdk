[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibraryLowCodeComponent

# Function: DesignLibraryLowCodeComponent()

> **DesignLibraryLowCodeComponent**(): `Element`

Defined in: [packages/react/src/components/DesignLibrary/DesignLibraryLowCodeComponent.tsx:51](https://github.com/Sitecore/content-sdk/blob/2db997286d1a49ba2de622f5535feed2205c999a/packages/react/src/components/DesignLibrary/DesignLibraryLowCodeComponent.tsx#L51)

**`Internal`**

Design Library Low Code component.

Facilitates the communication between the Design Studio and the Rendering Host when previewing a low code component built with the Atoms.
- On mount, it serializes the atoms catalog and sends it to the Design Studio via the `atoms:catalog` event.
- Receives Component model data updates via document update handler and renders the low code component
via `StudioComponentWrapper` (same client path as Studio / NCC preview elsewhere).
- When `atomsConfig.compileCssAction` is provided, compiles Document class names and injects CSS so
utilities that exist only in MMS Document JSON are styled during editing.
- Wraps preview output with `PlaceholderMetadata` using the layout rendering UID so Design Studio
receives the same chrome handshake as normal Design Library components.

## Returns

`Element`

The low-code preview surface.
