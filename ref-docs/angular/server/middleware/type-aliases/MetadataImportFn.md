[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / MetadataImportFn

# Type Alias: MetadataImportFn

> **MetadataImportFn** = () => `Promise`\<\{ `default`: `Metadata`; \} \| `Metadata`\>

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/d8ac4e3318843744564114f23a00a7a35cd2e2c3/packages/angular/src/server/middleware/editing-config-middleware.ts#L21)

Factory that dynamically imports application metadata (typically
`.sitecore/metadata.json` emitted by `sitecore-tools`).

## Returns

`Promise`\<\{ `default`: `Metadata`; \} \| `Metadata`\>
