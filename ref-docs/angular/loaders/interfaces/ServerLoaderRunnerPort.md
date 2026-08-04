[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / ServerLoaderRunnerPort

# Interface: ServerLoaderRunnerPort

Defined in: [packages/angular/src/loaders/server-loader-runner.token.ts:10](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/loaders/server-loader-runner.token.ts#L10)

SSR injection port for cache-aware loader resolution.
Implemented by `ServerLoaderRunner` and wired via
`provideServerLoaderRunner` (see the `server/express` module).

## Methods

### resolve()

> **resolve**(`init`): `Promise`\<[`LoaderDataResult`](../type-aliases/LoaderDataResult.md)\>

Defined in: [packages/angular/src/loaders/server-loader-runner.token.ts:16](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/loaders/server-loader-runner.token.ts#L16)

Resolve loader data on the server (cache-aware) using the shared [LOADER\_REGISTRY](../variables/LOADER_REGISTRY.md).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `init` | [`LoaderRunnerInit`](../type-aliases/LoaderRunnerInit.md) | Loader request payload |

#### Returns

`Promise`\<[`LoaderDataResult`](../type-aliases/LoaderDataResult.md)\>

Resolved loader result
