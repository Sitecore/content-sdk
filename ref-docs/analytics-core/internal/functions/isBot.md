[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / isBot

# Function: isBot()

> **isBot**(`userAgent?`): `boolean`

Defined in: [analytics-core/src/bot-detection/bot-detection.ts:17](https://github.com/Sitecore/content-sdk/blob/cb6406f86fa34d759a763a19ec61e60afcd2c74d/packages/analytics-core/src/bot-detection/bot-detection.ts#L17)

**`Internal`**

A function that checks if visitor is a bot.
Performs a check based on the user agent.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userAgent?` | `string` \| `null` | The user agent of the visitor |

## Returns

`boolean`

True if the visitor is a bot, false otherwise
