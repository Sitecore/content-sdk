[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / getDesignLibraryAtomsCatalogEvent

# Function: getDesignLibraryAtomsCatalogEvent()

> **getDesignLibraryAtomsCatalogEvent**(`payload`): `DesignLibraryAtomsCatalogEvent`

Defined in: [content/src/atoms/design-library-bridge/events.ts:23](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/content/src/atoms/design-library-bridge/events.ts#L23)

**`Internal`**

Creates a DesignLibraryAtomsCatalogEvent with the given catalog payload.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`SerializedCatalog`](../interfaces/SerializedCatalog.md) | serialized catalog data |

## Returns

`DesignLibraryAtomsCatalogEvent`

the event ready to be posted to Design Studio
