[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [server](../README.md) / personalize

# Function: personalize()

> **personalize**\<`T`\>(`request`, `personalizeData`, `opts?`): `Promise`\<`unknown`\>

Defined in: [personalization/personalizeServer.ts:24](https://github.com/Sitecore/content-sdk/blob/93fb4095715f238f6ba12b275948e1f3a8215ed2/packages/personalize/src/personalization/personalizeServer.ts#L24)

A function that executes an interactive experiment or web experiment over any web-based or mobile application.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Request` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `T` | The request object, either a Middleware Request or an HTTP Request |
| `personalizeData` | [`PersonalizeData`](../../browser/interfaces/PersonalizeData.md) | The required/optional attributes in order to create a flow execution |
| `opts?` | `PersonalizeServerOpts` | An optional object containing additional options such as timeout. Used to abort the request to execute an interactive experiment or web experiment. |

## Returns

`Promise`\<`unknown`\>

A flow execution response
