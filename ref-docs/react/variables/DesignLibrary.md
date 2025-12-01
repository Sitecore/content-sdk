[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibrary

# Variable: DesignLibrary

> `const` **DesignLibrary**: \{(`props`): `Element`; `displayName`: `string`; \}

Defined in: [packages/react/src/components/DesignLibrary/DesignLibrary.tsx:52](https://github.com/Sitecore/content-sdk/blob/7b8476640126d70d455d8644f33dbe2995b3a042/packages/react/src/components/DesignLibrary/DesignLibrary.tsx#L52)

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
