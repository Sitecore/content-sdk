[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / rewriteEdgeHostInResponse

# Function: rewriteEdgeHostInResponse()

> **rewriteEdgeHostInResponse**\<`T`\>(`response`, `edgeUrl`): `T`

Defined in: [content/src/layout/rewrite-edge-host.ts:59](https://github.com/Sitecore/content-sdk/blob/932dec9d0ea130c3f620b32f2a21cb0a49bd0481/packages/content/src/layout/rewrite-edge-host.ts#L59)

Rewrites Experience Edge hostnames in a response object to use the custom hostname.
This function performs a deep traversal of the object and replaces any string values
containing the default Experience Edge hostname with the custom hostname.
Caller should pass the Experience Edge URL (e.g. from resolveExperienceEdgeUrl()).

Use case: Experience Edge returns Layout Service output (layout, placeholders, component fields).
Field values can contain URLs with the Edge hostname—e.g. Image field `value.src`
(`https://edge.sitecorecloud.io/-/media/...`), Rich Text HTML (`<img src="...">`),
or link `href`. When using a custom hostname (e.g. CDN in front of Edge), these URLs
must be rewritten so layout API and media requests both go through the custom host.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `response` | `T` | The response object to process (typically LayoutServiceData) |
| `edgeUrl` | `string` | Experience Edge URL to rewrite to (e.g. from resolveExperienceEdgeUrl). |

## Returns

`T`

The response object with Experience Edge hostnames rewritten (same reference if no custom hostname)

## Example

```ts
const layout = await layoutService.fetchLayoutData(path, options);
const rewritten = rewriteEdgeHostInResponse(layout, resolveExperienceEdgeUrl());
```
