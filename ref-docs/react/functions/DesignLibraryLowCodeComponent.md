[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibraryLowCodeComponent

# Function: DesignLibraryLowCodeComponent()

> **DesignLibraryLowCodeComponent**(): `Element`

Defined in: [packages/react/src/components/DesignLibrary/DesignLibraryLowCodeComponent.tsx:44](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/react/src/components/DesignLibrary/DesignLibraryLowCodeComponent.tsx#L44)

**`Internal`**

Design Library Low Code component.

Facilitates the communication between the Design Studio and the Rendering Host when previewing a low code component built with the Atoms.
- On mount, it serializes the atoms catalog and sends it to the Design Studio via the `atoms:catalog` event.
- Receives Component model data updates via document update handler and renders the low code component
via `StudioComponentWrapper` (same client path as Studio / NCC preview elsewhere).

## Returns

`Element`
