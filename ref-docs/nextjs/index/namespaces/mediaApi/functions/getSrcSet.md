[**@sitecore-content-sdk/nextjs**](../../../../README.md)

***

[@sitecore-content-sdk/nextjs](../../../../README.md) / [index](../../../README.md) / [mediaApi](../README.md) / getSrcSet

# Function: getSrcSet()

> **getSrcSet**(`url`, `srcSet`, `imageParams`?, `mediaUrlPrefix`?): `string`

Defined in: core/types/media/media-api.d.ts:51

Receives an array of `srcSet` parameters that are iterated and used as parameters to generate
a corresponding set of updated Sitecore media URLs via

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to prepare |
| `srcSet` | `object`[] | The array of parameters to use |
| `imageParams`? | \{\} | The querystring parameters to use |
| `mediaUrlPrefix`? | `RegExp` | The regex to match the media URL prefix |

## Returns

`string`

The prepared URL

## See

updateImageUrl. The result is a comma-delimited
list of media URLs with respective dimension parameters.

## Example

```ts
// returns '/ipsum.jpg?h=1000&w=1000 1000w, /ipsum.jpg?mh=250&mw=250 250w'
getSrcSet('/ipsum.jpg', [{ h: 1000, w: 1000 }, { mh: 250, mw: 250 } ])
More information about `srcSet`: {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img}
```
