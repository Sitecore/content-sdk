[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / validateEvent

# Function: validateEvent()

> **validateEvent**(`e`, `eventName`): `boolean`

Defined in: [content/src/editing/design-library.ts:120](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/content/src/editing/design-library.ts#L120)

**`Internal`**

Validates that a MessageEvent has the expected event name and required data.
Logs debug information when validation fails due to invalid origin.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MessageEvent` | The message event to validate. |
| `eventName` | `string` | The expected event name to match against e.data.name. |

## Returns

`boolean`

True if the event has a valid origin, data object, and matching event name; otherwise false.
