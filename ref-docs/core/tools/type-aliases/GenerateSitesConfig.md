[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig** = `object`

Defined in: [packages/core/src/tools/generateSites.ts:16](https://github.com/Sitecore/content-sdk/blob/85591cf20d4c825ff61be473aebb13cc7d7d5460/packages/core/src/tools/generateSites.ts#L16)

Configuration object for generating sites.

## Properties

### destinationPath?

> `optional` **destinationPath**: `string`

Defined in: [packages/core/src/tools/generateSites.ts:26](https://github.com/Sitecore/content-sdk/blob/85591cf20d4c825ff61be473aebb13cc7d7d5460/packages/core/src/tools/generateSites.ts#L26)

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

***

### scConfig

> **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [packages/core/src/tools/generateSites.ts:20](https://github.com/Sitecore/content-sdk/blob/85591cf20d4c825ff61be473aebb13cc7d7d5460/packages/core/src/tools/generateSites.ts#L20)

The Sitecore configuration used at build and run time.
