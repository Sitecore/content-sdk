[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / getComponentLibraryStatusEvent

# Function: getComponentLibraryStatusEvent()

> **getComponentLibraryStatusEvent**(`status`, `uid`): [`ComponentLibraryStatusEvent`](../interfaces/ComponentLibraryStatusEvent.md)

Defined in: [packages/core/src/editing/component-library.ts:134](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/core/src/editing/component-library.ts#L134)

Generates a ComponentLibraryStatusEvent with the given status and uid.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `status` | [`ComponentLibraryStatus`](../enumerations/ComponentLibraryStatus.md) | The status of rendering. |
| `uid` | `string` | The unique identifier for the event. |

## Returns

[`ComponentLibraryStatusEvent`](../interfaces/ComponentLibraryStatusEvent.md)

An object representing the ComponentLibraryStatusEvent.
