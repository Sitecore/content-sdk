[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / getDesignLibraryStatusEvent

# Function: getDesignLibraryStatusEvent()

> **getDesignLibraryStatusEvent**(`status`, `uid`, `isRenderingServerComponent?`): [`DesignLibraryStatusEvent`](../interfaces/DesignLibraryStatusEvent.md)

Defined in: [content/src/editing/design-library.ts:217](https://github.com/Sitecore/content-sdk/blob/cfea6f37e3bdfe18c9aded77b244ce21391adbfd/packages/content/src/editing/design-library.ts#L217)

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
