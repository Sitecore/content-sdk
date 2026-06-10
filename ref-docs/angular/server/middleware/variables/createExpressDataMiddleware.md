[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createExpressDataMiddleware

# Variable: createExpressDataMiddleware

> `const` **createExpressDataMiddleware**: (`options`) => [`ExpressMiddleware`](../../express/type-aliases/ExpressMiddleware.md) = `createLoaderDataServiceMiddleware`

Defined in: [packages/angular/src/server/middleware/loader-data-service-middleware.ts:147](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/server/middleware/loader-data-service-middleware.ts#L147)

Create an Express middleware for the data endpoint.
This middleware handles both GET and POST requests at the configured endpoint path.

The endpoint path must match the client: provide the same value to the Angular app via
FETCH_DATA_ENDPOINT (e.g. in app.config.ts). There is no Angular DI in Node/Express,
so you pass the endpoint here when calling this function (e.g. from server.ts).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`ExpressDataHandlerOptions`](../../express/interfaces/ExpressDataHandlerOptions.md) | Handler options: loaders and optional endpoint (defaults to [LOADER\_DATA\_ENDPOINT](../../express/variables/LOADER_DATA_ENDPOINT.md)) |

## Returns

[`ExpressMiddleware`](../../express/type-aliases/ExpressMiddleware.md)

Express middleware that handles the data endpoint

## Example

```typescript
import { createExpressDataMiddleware, LOADER_DATA_ENDPOINT } from '@sitecore-content-sdk/angular';

// Pass the same LOADERS object used with provideLoaderRegistry(LOADERS)
app.use(createExpressDataMiddleware({ loaders: LOADERS }));

// Or pass the same endpoint you provide to the Angular app (FETCH_DATA_ENDPOINT)
const dataEndpoint = process.env.DATA_ENDPOINT ?? LOADER_DATA_ENDPOINT;
app.use(createExpressDataMiddleware({ loaders: LOADERS, endpoint: dataEndpoint }));
```
