[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / DesignLibrary

# Variable: DesignLibrary()

> `const` **DesignLibrary**: (`{ loadImportMap }`) => `React.JSX.Element`

Defined in: react/types/components/DesignLibrary.d.ts:25

Design Library component.

Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
wires the **variant generation** handshake so the parent (DL Studio) can send
generated code to preview and iterate on.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `{ loadImportMap }` | `DesignLibraryProps` |

## Returns

`React.JSX.Element`

The preview surface, or `null` when not in Design Library mode.
