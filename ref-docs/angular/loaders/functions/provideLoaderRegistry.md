[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / provideLoaderRegistry

# Function: provideLoaderRegistry()

> **provideLoaderRegistry**(`loaders`): `Provider`[]

Defined in: [packages/angular/src/loaders/loader-registry.token.ts:31](https://github.com/Sitecore/content-sdk/blob/396935c78ae029a02fc0b86aaa7283fab025ee20/packages/angular/src/loaders/loader-registry.token.ts#L31)

Registers the app's loader registry for DI. Pass the loaders your app uses
(e.g. page, '404', '500'). Use the **same object** with
createLoaderDataServiceMiddleware in `server.ts` so SSR and CSR
navigations resolve the same loader functions.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `loaders` | [`LoaderRegistry`](../type-aliases/LoaderRegistry.md) | Map of loader id to loader function |

## Returns

`Provider`[]
