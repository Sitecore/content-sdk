[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderFn

# Type Alias: LoaderFn\<T\>

> **LoaderFn**\<`T`\> = (`ctx`) => `Promise`\<`T`\> \| `T` \| [`LoaderRedirectResult`](LoaderRedirectResult.md)

Defined in: [packages/angular/src/loaders/models.ts:170](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/loaders/models.ts#L170)

Loader function type.
A loader is an async function that receives context, can be applied in route resolvers and can return:
- data - any data that can be serialized and stored in the transfer state
- redirect - a redirect to be applied to the router
- throw error - an error that occurred during the retrieval of the data

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`LoaderContext`](LoaderContext.md) |

## Returns

`Promise`\<`T`\> \| `T` \| [`LoaderRedirectResult`](LoaderRedirectResult.md)
