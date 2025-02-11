[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [media](../../../README.md) / [mediaApi](../README.md) / updateImageUrl

# Function: updateImageUrl()

> **updateImageUrl**(`url`, `params`?, `mediaUrlPrefix`?): `string`

Defined in: [packages/core/src/media/media-api.ts:50](https://github.com/Sitecore/xmc-jss-dev/blob/d7b466243452103e100673b5863a2d80ef6e68eb/packages/core/src/media/media-api.ts#L50)

Prepares a Sitecore media URL with `params` for use by the JSS media handler.
This is done by replacing `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
Provided `params` are used as the querystring parameters for the media URL.
Can use `mediaUrlPrefix` in order to use a custom prefix.
If no `params` are sent, the original media URL is returned.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | The URL to prepare |
| `params`? | `null` \| \{\} | `undefined` | The querystring parameters to use |
| `mediaUrlPrefix`? | `RegExp` | `mediaUrlPrefixRegex` | The regex to match the media URL prefix |

## Returns

`string`

The prepared URL
