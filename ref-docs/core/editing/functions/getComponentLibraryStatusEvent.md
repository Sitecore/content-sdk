[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / getComponentLibraryStatusEvent

# Function: getComponentLibraryStatusEvent()

> **getComponentLibraryStatusEvent**(`status`, `uid`): [`ComponentLibraryStatusEvent`](../interfaces/ComponentLibraryStatusEvent.md)

Defined in: [packages/core/src/editing/component-library.ts:134](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/editing/component-library.ts#L134)

Generates a ComponentLibraryStatusEvent with the given status and uid.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `status` | [`ComponentLibraryStatus`](../enumerations/ComponentLibraryStatus.md) | The status of rendering. |
| `uid` | `string` | The unique identifier for the event. |

## Returns

[`ComponentLibraryStatusEvent`](../interfaces/ComponentLibraryStatusEvent.md)

An object representing the ComponentLibraryStatusEvent.
