[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / isBot

# Function: isBot()

> **isBot**(`userAgent?`): `boolean`

Defined in: [analytics-core/src/bot-detection/bot-detection.ts:17](https://github.com/Sitecore/content-sdk/blob/7b3b3f30369cf56f5de19926b02ee549d98a34dc/packages/analytics-core/src/bot-detection/bot-detection.ts#L17)

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
