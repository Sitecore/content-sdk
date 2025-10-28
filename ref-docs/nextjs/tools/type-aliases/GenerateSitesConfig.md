[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig** = `object`

Defined in: core/types/tools/generateSites.d.ts:5

Configuration object for generating sites.

## Properties

### destinationPath?

> `optional` **destinationPath**: `string`

Defined in: core/types/tools/generateSites.d.ts:15

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

***

### ~~scConfig?~~

> `optional` **scConfig**: `SitecoreConfig`

Defined in: core/types/tools/generateSites.d.ts:10

The Sitecore configuration used at build and run time.

#### Deprecated

Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
