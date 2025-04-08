[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig**: `object`

Defined in: [packages/core/src/tools/generateSites.ts:15](https://github.com/Sitecore/content-sdk/blob/54bfbce78f2a0f648621bd4459cb5183c17802eb/packages/core/src/tools/generateSites.ts#L15)

Configuration object for generating sites.

## Type declaration

### destinationPath?

> `optional` **destinationPath**: `string`

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

### scConfig

> **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

The Sitecore configuration used at build and run time.
