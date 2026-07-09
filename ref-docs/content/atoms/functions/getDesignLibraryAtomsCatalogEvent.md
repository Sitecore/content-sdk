[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / getDesignLibraryAtomsCatalogEvent

# Function: getDesignLibraryAtomsCatalogEvent()

> **getDesignLibraryAtomsCatalogEvent**(`payload`): `DesignLibraryAtomsCatalogEvent`

Defined in: [content/src/atoms/design-library-bridge/events.ts:23](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/content/src/atoms/design-library-bridge/events.ts#L23)

**`Internal`**

Creates a DesignLibraryAtomsCatalogEvent with the given catalog payload.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`SerializedCatalog`](../interfaces/SerializedCatalog.md) | serialized catalog data |

## Returns

`DesignLibraryAtomsCatalogEvent`

the event ready to be posted to Design Studio
