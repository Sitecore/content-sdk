[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / getComponentLibraryStatusEvent

# Function: getComponentLibraryStatusEvent()

> **getComponentLibraryStatusEvent**(`status`, `uid`): [`ComponentLibraryStatusEvent`](../interfaces/ComponentLibraryStatusEvent.md)

Defined in: [packages/core/src/editing/component-library.ts:134](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/core/src/editing/component-library.ts#L134)

Generates a ComponentLibraryStatusEvent with the given status and uid.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `status` | [`ComponentLibraryStatus`](../enumerations/ComponentLibraryStatus.md) | The status of rendering. |
| `uid` | `string` | The unique identifier for the event. |

## Returns

[`ComponentLibraryStatusEvent`](../interfaces/ComponentLibraryStatusEvent.md)

An object representing the ComponentLibraryStatusEvent.
