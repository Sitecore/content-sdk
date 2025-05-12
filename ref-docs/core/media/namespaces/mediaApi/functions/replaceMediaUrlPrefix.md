[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [media](../../../README.md) / [mediaApi](../README.md) / replaceMediaUrlPrefix

# Function: replaceMediaUrlPrefix()

> **replaceMediaUrlPrefix**(`url`, `mediaUrlPrefix?`): `string`

Defined in: [packages/core/src/media/media-api.ts:24](https://github.com/Sitecore/content-sdk/blob/eb3a033122ca57fc4562bef04a2d36e3fbd30f7c/packages/core/src/media/media-api.ts#L24)

Replace `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
Can use `mediaUrlPrefix` in order to use a custom prefix.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | The URL to replace the media URL prefix in |
| `mediaUrlPrefix?` | `RegExp` | `mediaUrlPrefixRegex` | The regex to match the media URL prefix |

## Returns

`string`

The URL with the media URL prefix replaced
