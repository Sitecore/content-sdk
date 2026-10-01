[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / getDesignLibraryStatusEvent

# Function: getDesignLibraryStatusEvent()

> **getDesignLibraryStatusEvent**(`status`, `uid`, `isRenderingServerComponent?`): [`DesignLibraryStatusEvent`](../interfaces/DesignLibraryStatusEvent.md)

Defined in: [content/src/editing/design-library.ts:226](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/content/src/editing/design-library.ts#L226)

**`Internal`**

Generates a DesignLibraryStatusEvent with the given status and uid.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `status` | [`DesignLibraryStatus`](../enumerations/DesignLibraryStatus.md) | `undefined` | The status of rendering. |
| `uid` | `string` | `undefined` | The unique identifier for the event. |
| `isRenderingServerComponent?` | `boolean` | `false` | Indicates if the component being rendered is a server component. |

## Returns

[`DesignLibraryStatusEvent`](../interfaces/DesignLibraryStatusEvent.md)

An object representing the DesignLibraryStatusEvent.
