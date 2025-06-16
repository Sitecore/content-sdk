[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig** = `object`

Defined in: [packages/core/src/tools/generateSites.ts:15](https://github.com/Sitecore/content-sdk/blob/0b5dd8bac22c56f5e192dc58b2a7a23d366c7cc3/packages/core/src/tools/generateSites.ts#L15)

Configuration object for generating sites.

## Properties

### destinationPath?

> `optional` **destinationPath**: `string`

Defined in: [packages/core/src/tools/generateSites.ts:25](https://github.com/Sitecore/content-sdk/blob/0b5dd8bac22c56f5e192dc58b2a7a23d366c7cc3/packages/core/src/tools/generateSites.ts#L25)

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

***

### scConfig

> **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [packages/core/src/tools/generateSites.ts:19](https://github.com/Sitecore/content-sdk/blob/0b5dd8bac22c56f5e192dc58b2a7a23d366c7cc3/packages/core/src/tools/generateSites.ts#L19)

The Sitecore configuration used at build and run time.
