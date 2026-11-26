[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / validateEvent

# Function: validateEvent()

> **validateEvent**(`e`, `eventName`): `boolean`

Defined in: [content/src/editing/design-library.ts:151](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/content/src/editing/design-library.ts#L151)

**`Internal`**

Validates that a MessageEvent has the expected event name, required data and a valid origin.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MessageEvent` | The message event to validate. |
| `eventName` | `string` | The expected event name to match against e.data.name. |

## Returns

`boolean`

True if the event should be processed; otherwise false.
