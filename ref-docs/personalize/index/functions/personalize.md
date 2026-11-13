[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [index](../README.md) / personalize

# Function: personalize()

> **personalize**(`personalizeData`, `opts?`): `Promise`\<`unknown`\>

Defined in: [personalize/src/personalization/personalize.ts:15](https://github.com/Sitecore/content-sdk/blob/84b2ebcb77b1c88a88e7b2b7d4b9b7117148025d/packages/personalize/src/personalization/personalize.ts#L15)

A function that executes an interactive/web experiment over any web-based/mobile application.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `personalizeData` | [`PersonalizeData`](../interfaces/PersonalizeData.md) | The required/optional attributes for a flow execution. |
| `opts?` | [`PersonalizeOpts`](../interfaces/PersonalizeOpts.md) | An object containing additional options. |

## Returns

`Promise`\<`unknown`\>

A flow execution response.
