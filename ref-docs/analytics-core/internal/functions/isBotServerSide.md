[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / isBotServerSide

# Function: isBotServerSide()

> **isBotServerSide**(`cookie?`, `userAgent?`): `boolean`

Defined in: [analytics-core/src/bot-detection/bot-detection.ts:41](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/analytics-core/src/bot-detection/bot-detection.ts#L41)

**`Internal`**

A function that checks if visitor is a bot.
Performs a check based on the bot cookie and the user agent.
Only available on the server-side.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cookie?` | `string` | The cookie string. |
| `userAgent?` | `string` \| `null` | The user agent of the visitor |

## Returns

`boolean`

True if the visitor is a bot, false otherwise
