[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / getDesignLibraryAtomsCatalogEvent

# Function: getDesignLibraryAtomsCatalogEvent()

> **getDesignLibraryAtomsCatalogEvent**(`payload`): `DesignLibraryAtomsCatalogEvent`

Defined in: [content/src/atoms/design-library-bridge/events.ts:23](https://github.com/Sitecore/content-sdk/blob/67aa52ba0cee57732483f58d187367f0b89f05a1/packages/content/src/atoms/design-library-bridge/events.ts#L23)

**`Internal`**

Creates a DesignLibraryAtomsCatalogEvent with the given catalog payload.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`SerializedCatalog`](../interfaces/SerializedCatalog.md) | serialized catalog data |

## Returns

`DesignLibraryAtomsCatalogEvent`

the event ready to be posted to Design Studio
