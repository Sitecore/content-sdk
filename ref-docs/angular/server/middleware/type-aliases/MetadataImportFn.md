[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / MetadataImportFn

# Type Alias: MetadataImportFn

> **MetadataImportFn** = () => `Promise`\<\{ `default`: `Metadata`; \} \| `Metadata`\>

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/c9c8d1c0cd9bd014c418f5695be825137a97e6ba/packages/angular/src/server/middleware/editing-config-middleware.ts#L21)

Factory that dynamically imports application metadata (typically
`.sitecore/metadata.json` emitted by `sitecore-tools`).

## Returns

`Promise`\<\{ `default`: `Metadata`; \} \| `Metadata`\>
