[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [browser](../README.md) / personalize

# Function: personalize()

> **personalize**(`personalizeData`, `opts?`): `Promise`\<`unknown`\>

Defined in: [personalization/personalize.ts:29](https://github.com/Sitecore/content-sdk/blob/8dcb9d458e61f7c39bf98898c9a004ce461038f8/packages/personalize/src/personalization/personalize.ts#L29)

A function that executes an interactive experiment or web experiment over any web-based or mobile application.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `personalizeData` | [`PersonalizeData`](../interfaces/PersonalizeData.md) | The required/optional attributes in order to create a flow execution |
| `opts?` | `PersonalizeOpts` | An object containing additional options |

## Returns

`Promise`\<`unknown`\>

A flow execution response
