[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibrary

# Variable: DesignLibrary

> `const` **DesignLibrary**: \{(`props`): `Element`; `displayName`: `string`; \}

Defined in: [packages/react/src/components/DesignLibrary/DesignLibrary.tsx:53](https://github.com/Sitecore/content-sdk/blob/a8134eb1d6b0ccc6bea8513dc8a31f6c8f5bb353/packages/react/src/components/DesignLibrary/DesignLibrary.tsx#L53)

Design Library component.

Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
wires the **variant generation** handshake so the parent (DL Studio) can send
generated code to preview and iterate on.

## Type declaration

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `DesignLibraryProps` |  |

## Returns

`Element`

The preview surface, or `null` when not in Design Library mode.

### displayName

> **displayName**: `string`
