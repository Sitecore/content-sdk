[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / ServerLoaderRunnerPort

# Interface: ServerLoaderRunnerPort

Defined in: [packages/angular/src/loaders/server-loader-runner.token.ts:10](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/server-loader-runner.token.ts#L10)

SSR injection port for cache-aware loader resolution.
Implemented by `ServerLoaderRunner` and wired via
`provideServerLoaderRunner` (see the `server/express` module).

## Methods

### resolve()

> **resolve**(`request`): `Promise`\<[`LoaderDataResult`](../type-aliases/LoaderDataResult.md)\>

Defined in: [packages/angular/src/loaders/server-loader-runner.token.ts:16](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/server-loader-runner.token.ts#L16)

Resolve loader data on the server (cache-aware) using the shared [LOADER\_REGISTRY](../variables/LOADER_REGISTRY.md).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | [`LoaderApiRequest`](../type-aliases/LoaderApiRequest.md) | Loader request payload |

#### Returns

`Promise`\<[`LoaderDataResult`](../type-aliases/LoaderDataResult.md)\>

Resolved loader result
