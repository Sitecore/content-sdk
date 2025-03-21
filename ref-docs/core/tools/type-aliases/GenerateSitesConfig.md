[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig**: `object`

Defined in: [packages/core/src/tools/generateSites.ts:15](https://github.com/Sitecore/xmc-jss-dev/blob/24bfb351cb3f21ca109885aec5c8f4d4d5e46084/packages/core/src/tools/generateSites.ts#L15)

Configuration object for generating sites.

## Type declaration

### destinationPath?

> `optional` **destinationPath**: `string`

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

### scConfig

> **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

The Sitecore configuration used at build and run time.
