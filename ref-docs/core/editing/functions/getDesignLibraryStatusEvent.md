[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / getDesignLibraryStatusEvent

# Function: getDesignLibraryStatusEvent()

> **getDesignLibraryStatusEvent**(`status`, `uid`): [`DesignLibraryStatusEvent`](../interfaces/DesignLibraryStatusEvent.md)

Defined in: [packages/core/src/editing/design-library.ts:137](https://github.com/Sitecore/content-sdk/blob/d44ca4cb30a7b5875ef1f803a65999c8dbb631bd/packages/core/src/editing/design-library.ts#L137)

Generates a DesignLibraryStatusEvent with the given status and uid.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `status` | [`DesignLibraryStatus`](../enumerations/DesignLibraryStatus.md) | The status of rendering. |
| `uid` | `string` | The unique identifier for the event. |

## Returns

[`DesignLibraryStatusEvent`](../interfaces/DesignLibraryStatusEvent.md)

An object representing the DesignLibraryStatusEvent.
