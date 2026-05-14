# SSR, Express, and loader middleware (Angular)

Express bootstrap order for **`loader-data-service`**, JSON parsing, and the Angular SSR handler.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## Middleware order

The design PDF states that **`loader-data-service`** is registered **before** the browser static folder and the main Angular SSR handler. The template’s **`server.ts`** uses **`express.json()`** first (so **`POST /_data`** bodies parse), then **`createLoaderDataServiceMiddleware({ loaders: LOADERS })`**, then static assets, then the SSR entry.

That order matters because the browser **`LoaderDataService`** issues **`POST`** requests with a JSON body to the default **`LOADER_DATA_ENDPOINT`** (**`/_data`**, `packages/angular/src/server/constants.ts`).

## Handler shape

**`createLoaderDataServiceMiddleware`** exposes **GET** and **POST** on the same path, validates **`loaderId` / `url` / params / query**, runs **`executeLoader`**, and returns a **`LoaderApiResponse`** JSON payload (`loader-data-service-middleware.ts`).

**Related:** [doc-loader-resolver-transfer-state-and-endpoint.md](doc-loader-resolver-transfer-state-and-endpoint.md)
