[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibraryLowCodeComponent

# Function: DesignLibraryLowCodeComponent()

> **DesignLibraryLowCodeComponent**(`props`): `Element`

Defined in: [packages/react/src/components/DesignLibrary/DesignLibraryLowCodeComponent.tsx:62](https://github.com/Sitecore/content-sdk/blob/67aa52ba0cee57732483f58d187367f0b89f05a1/packages/react/src/components/DesignLibrary/DesignLibraryLowCodeComponent.tsx#L62)

**`Internal`**

Design Library Low Code component.

Facilitates the communication between the Design Studio and the Rendering Host when previewing a low code component built with the Atoms.
- On mount, it serializes the atoms catalog and sends it to the Design Studio via the `atoms:catalog` event.
- Receives Component model data updates via document update handler and renders the low code component
via `StudioComponentWrapper` (same client path as Studio / NCC preview elsewhere).
- Wraps preview output with `PlaceholderMetadata` using the layout rendering UID so Design Studio
receives the same chrome handshake as normal Design Library components.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`DesignLibraryLowCodeComponentProps`](../type-aliases/DesignLibraryLowCodeComponentProps.md) | Component props. |

## Returns

`Element`

The low-code preview surface.
