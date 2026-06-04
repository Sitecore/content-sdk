[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [media](../../../README.md) / [mediaApi](../README.md) / replaceMediaUrlPrefix

# Function: replaceMediaUrlPrefix()

> **replaceMediaUrlPrefix**(`url`, `mediaUrlPrefix?`): `string`

Defined in: [content/src/media/media-api.ts:83](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/content/src/media/media-api.ts#L83)

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
