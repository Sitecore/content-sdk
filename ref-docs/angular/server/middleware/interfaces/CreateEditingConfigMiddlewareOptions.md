[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / CreateEditingConfigMiddlewareOptions

# Interface: CreateEditingConfigMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/angular/src/server/middleware/editing-config-middleware.ts#L27)

Options for [createEditingConfigMiddleware](../functions/createEditingConfigMiddleware.md).

## Properties

### components

> **components**: [`ComponentMap`](../../../components/type-aliases/ComponentMap.md)

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:32](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/angular/src/server/middleware/editing-config-middleware.ts#L32)

Component map registered with the Angular app
(the same map provided to `SITECORE_COMPONENT_MAP`).

***

### editingSecret?

> `optional` **editingSecret?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:49](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/angular/src/server/middleware/editing-config-middleware.ts#L49)

Editing secret to validate. Defaults to the `SITECORE_EDITING_SECRET`
environment variable.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/angular/src/server/middleware/editing-config-middleware.ts#L51)

Endpoint path; default `/api/editing/config`.

***

### metadata?

> `optional` **metadata?**: `Metadata`

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/angular/src/server/middleware/editing-config-middleware.ts#L38)

Inline metadata. When set, [metadataImport](#metadataimport) is ignored.
When neither `metadata` nor `metadataImport` is provided, the middleware
responds with `{ packages: {} }`.

***

### metadataImport?

> `optional` **metadataImport?**: [`MetadataImportFn`](../type-aliases/MetadataImportFn.md)

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:44](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/angular/src/server/middleware/editing-config-middleware.ts#L44)

Optional dynamic import for metadata (e.g. from `.sitecore/metadata.json`).
Use createSitecoreMetadataImport to build the conventional path
relative to `server.ts`. Import failures fall back to empty packages.
