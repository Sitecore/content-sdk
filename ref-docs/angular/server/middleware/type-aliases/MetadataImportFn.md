[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / MetadataImportFn

# Type Alias: MetadataImportFn

> **MetadataImportFn** = () => `Promise`\<\{ `default`: `Metadata`; \} \| `Metadata`\>

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/server/middleware/editing-config-middleware.ts#L21)

Factory that dynamically imports application metadata (typically
`.sitecore/metadata.json` emitted by `sitecore-tools`).

## Returns

`Promise`\<\{ `default`: `Metadata`; \} \| `Metadata`\>
