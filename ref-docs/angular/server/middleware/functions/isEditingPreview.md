[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / isEditingPreview

# Function: isEditingPreview()

> **isEditingPreview**(`headers?`): `boolean`

Defined in: [packages/angular/src/server/utils.ts:45](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/angular/src/server/utils.ts#L45)

**`Internal`**

Check if a request is in editing/preview mode, via the editing params header set by
[createEditingRenderMiddleware](createEditingRenderMiddleware.md) on the render request.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headers` | `Record`\<`string`, `string` \| `string`[] \| `undefined`\> | Request headers |

## Returns

`boolean`

True if editing or preview mode is active
