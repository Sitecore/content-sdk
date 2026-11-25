[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / CreateEditingConfigMiddlewareOptions

# Interface: CreateEditingConfigMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:29](https://github.com/Sitecore/content-sdk/blob/47aea23db5c87b62b269d8f5d3e2ee45d9901657/packages/angular/src/server/middleware/editing-config-middleware.ts#L29)

Options for [createEditingConfigMiddleware](../functions/createEditingConfigMiddleware.md).

## Properties

### components

> **components**: [`ComponentMap`](../../../components/type-aliases/ComponentMap.md)

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/47aea23db5c87b62b269d8f5d3e2ee45d9901657/packages/angular/src/server/middleware/editing-config-middleware.ts#L34)

Component map registered with the Angular app
(the same map provided to `SITECORE_COMPONENT_MAP`).

***

### editingSecret?

> `optional` **editingSecret?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/47aea23db5c87b62b269d8f5d3e2ee45d9901657/packages/angular/src/server/middleware/editing-config-middleware.ts#L51)

Editing secret to validate. Defaults to the `SITECORE_EDITING_SECRET`
environment variable.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/47aea23db5c87b62b269d8f5d3e2ee45d9901657/packages/angular/src/server/middleware/editing-config-middleware.ts#L53)

Endpoint path; default `/api/editing/config`.

***

### metadata?

> `optional` **metadata?**: `Metadata`

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/47aea23db5c87b62b269d8f5d3e2ee45d9901657/packages/angular/src/server/middleware/editing-config-middleware.ts#L40)

Inline metadata. When set, [metadataImport](#metadataimport) is ignored.
When neither `metadata` nor `metadataImport` is provided, the middleware
responds with `{ packages: {} }`.

***

### metadataImport?

> `optional` **metadataImport?**: [`MetadataImportFn`](../type-aliases/MetadataImportFn.md)

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:46](https://github.com/Sitecore/content-sdk/blob/47aea23db5c87b62b269d8f5d3e2ee45d9901657/packages/angular/src/server/middleware/editing-config-middleware.ts#L46)

Optional dynamic import for metadata (e.g. from `.sitecore/metadata.json`).
Use createSitecoreMetadataImport to build the conventional path
relative to `server.ts`. Import failures fall back to empty packages.
