[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / MetadataImportFn

# Type Alias: MetadataImportFn

> **MetadataImportFn** = () => `Promise`\<\{ `default`: `Metadata`; \} \| `Metadata`\>

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/c5d4841398e8e93474f43a16ca497a2fa4e0efae/packages/angular/src/server/middleware/editing-config-middleware.ts#L21)

Factory that dynamically imports application metadata (typically
`.sitecore/metadata.json` emitted by `sitecore-tools`).

## Returns

`Promise`\<\{ `default`: `Metadata`; \} \| `Metadata`\>
