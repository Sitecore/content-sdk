[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig** = `object`

Defined in: [packages/core/src/tools/generateSites.ts:15](https://github.com/Sitecore/content-sdk/blob/b729bf4210968ad33896556213eb3325c7a4a16e/packages/core/src/tools/generateSites.ts#L15)

Configuration object for generating sites.

## Properties

### destinationPath?

> `optional` **destinationPath**: `string`

Defined in: [packages/core/src/tools/generateSites.ts:25](https://github.com/Sitecore/content-sdk/blob/b729bf4210968ad33896556213eb3325c7a4a16e/packages/core/src/tools/generateSites.ts#L25)

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

***

### scConfig

> **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [packages/core/src/tools/generateSites.ts:19](https://github.com/Sitecore/content-sdk/blob/b729bf4210968ad33896556213eb3325c7a4a16e/packages/core/src/tools/generateSites.ts#L19)

The Sitecore configuration used at build and run time.
