[**@sitecore-content-sdk/react**](../../../README.md)

***

[@sitecore-content-sdk/react](../../../README.md) / [mediaApi](../README.md) / replaceMediaUrlPrefix

# Function: replaceMediaUrlPrefix()

> **replaceMediaUrlPrefix**(`url`, `mediaUrlPrefix`?): `string`

Defined in: packages/core/types/media/media-api.d.ts:22

Replace `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
Can use `mediaUrlPrefix` in order to use a custom prefix.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to replace the media URL prefix in |
| `mediaUrlPrefix`? | `RegExp` | The regex to match the media URL prefix |

## Returns

`string`

The URL with the media URL prefix replaced
