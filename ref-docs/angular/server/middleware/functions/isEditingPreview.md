[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / isEditingPreview

# Function: isEditingPreview()

> **isEditingPreview**(`headers?`): `boolean`

Defined in: [packages/angular/src/server/utils.ts:45](https://github.com/Sitecore/content-sdk/blob/08b5216f27c90a395a5ac8aa21cca1fd107676c6/packages/angular/src/server/utils.ts#L45)

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
