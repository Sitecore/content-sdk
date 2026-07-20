[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / isEditingPreview

# Function: isEditingPreview()

> **isEditingPreview**(`headers?`): `boolean`

Defined in: [packages/angular/src/server/utils.ts:45](https://github.com/Sitecore/content-sdk/blob/8b18c6e6c2cc3546028f5408655ca263435d7507/packages/angular/src/server/utils.ts#L45)

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
