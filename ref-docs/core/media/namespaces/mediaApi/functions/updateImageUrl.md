[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [media](../../../README.md) / [mediaApi](../README.md) / updateImageUrl

# Function: updateImageUrl()

> **updateImageUrl**(`url`, `params?`, `mediaUrlPrefix?`): `string`

Defined in: [packages/core/src/media/media-api.ts:50](https://github.com/Sitecore/content-sdk/blob/a01cc44e1fcc542a3a9ccd722895979634ef9b0a/packages/core/src/media/media-api.ts#L50)

Prepares a Sitecore media URL with `params` for use by the Content SDK media handler.
This is done by replacing `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
Provided `params` are used as the querystring parameters for the media URL.
Can use `mediaUrlPrefix` in order to use a custom prefix.
If no `params` are sent, the original media URL is returned.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | The URL to prepare |
| `params?` | `null` \| \{[`key`: `string`]: `undefined` \| `string` \| `number`; \} | `undefined` | The querystring parameters to use |
| `mediaUrlPrefix?` | `RegExp` | `mediaUrlPrefixRegex` | The regex to match the media URL prefix |

## Returns

`string`

The prepared URL
