[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig**: `object`

Defined in: core/types/tools/generateSites.d.ts:5

Configuration object for generating sites.

## Type declaration

### destinationPath?

> `optional` **destinationPath**: `string`

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

### scConfig

> **scConfig**: `SitecoreConfig`

The Sitecore configuration used at build and run time.
