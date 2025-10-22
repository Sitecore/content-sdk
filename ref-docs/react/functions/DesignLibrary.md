[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibrary

# Function: DesignLibrary()

> **DesignLibrary**(`props`): `Element`

Defined in: [packages/react/src/components/DesignLibrary.tsx:117](https://github.com/Sitecore/content-sdk/blob/54e2d32b8cfa6a9aec978ed0874e1d70711b6607/packages/react/src/components/DesignLibrary.tsx#L117)

Design Library component.

Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
wires the **variant generation** handshake so the parent (DL Studio) can send
generated code to preview and iterate on.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesignLibraryProps` |  |

## Returns

`Element`

The preview surface, or `null` when not in Design Library mode.
