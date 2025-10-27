[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibrary

# Function: DesignLibrary()

> **DesignLibrary**(`props`): `Element`

Defined in: [packages/react/src/components/DesignLibrary.tsx:117](https://github.com/Sitecore/content-sdk/blob/3c36d10259ff5fde8a86011b79e6e99deb6497df/packages/react/src/components/DesignLibrary.tsx#L117)

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
