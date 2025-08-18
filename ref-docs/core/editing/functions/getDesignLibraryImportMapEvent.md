[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / getDesignLibraryImportMapEvent

# Function: getDesignLibraryImportMapEvent()

> **getDesignLibraryImportMapEvent**(`uid`, `importsMap`): [`DesignLibraryImportMapEvent`](../interfaces/DesignLibraryImportMapEvent.md)

Defined in: [packages/core/src/editing/design-library.ts:294](https://github.com/Sitecore/content-sdk/blob/f3d9dc1c3ba47b83da1bdfcc1e79c93c32080015/packages/core/src/editing/design-library.ts#L294)

Generates a DesignLibraryImportMapEvent with the given uid and importsMap.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uid` | `string` | The unique identifier for the event. |
| `importsMap` | [`ImportEntry`](../interfaces/ImportEntry.md)[] | The imports map to be sent. |

## Returns

[`DesignLibraryImportMapEvent`](../interfaces/DesignLibraryImportMapEvent.md)

An object representing the DesignLibraryImportMapEvent.
