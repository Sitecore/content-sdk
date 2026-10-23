[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [media](../../../README.md) / [mediaApi](../README.md) / updateImageUrl

# Function: updateImageUrl()

> **updateImageUrl**(`url`, `params?`, `mediaUrlPrefix?`): `string`

Defined in: [content/src/media/media-api.ts:109](https://github.com/Sitecore/content-sdk/blob/aafdea48268ff14c60c3419c32fb6aeb10a2b118/packages/content/src/media/media-api.ts#L109)

Prepares a Sitecore media URL with `params` for use by the Content SDK media handler.
This is done by replacing `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
Provided `params` are used as the querystring parameters for the media URL.
Can use `mediaUrlPrefix` in order to use a custom prefix.
If no `params` are sent, the original media URL is returned.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | The URL to prepare |
| `params?` | \{\[`key`: `string`\]: `string` \| `number` \| `undefined`; \} \| `null` | `undefined` | The querystring parameters to use |
| `mediaUrlPrefix?` | `RegExp` | `mediaUrlPrefixRegex` | The regex to match the media URL prefix |

## Returns

`string`

The prepared URL
