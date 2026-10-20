[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / getDesignLibraryAtomsCatalogEvent

# Function: getDesignLibraryAtomsCatalogEvent()

> **getDesignLibraryAtomsCatalogEvent**(`payload`): `DesignLibraryAtomsCatalogEvent`

Defined in: [content/src/atoms/design-library-bridge/events.ts:24](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/content/src/atoms/design-library-bridge/events.ts#L24)

**`Internal`**

Creates a DesignLibraryAtomsCatalogEvent with the given catalog payload.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`SerializedCatalog`](../interfaces/SerializedCatalog.md) | serialized catalog data |

## Returns

`DesignLibraryAtomsCatalogEvent`

the event ready to be posted to Design Studio
