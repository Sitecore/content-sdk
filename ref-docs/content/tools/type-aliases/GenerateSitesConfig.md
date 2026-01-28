[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig** = `object`

Defined in: [content/src/tools/generateSites.ts:16](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/content/src/tools/generateSites.ts#L16)

Configuration object for generating sites.

## Properties

### destinationPath?

> `optional` **destinationPath**: `string`

Defined in: [content/src/tools/generateSites.ts:27](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/content/src/tools/generateSites.ts#L27)

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

***

### ~~scConfig?~~

> `optional` **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [content/src/tools/generateSites.ts:21](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/content/src/tools/generateSites.ts#L21)

The Sitecore configuration used at build and run time.

#### Deprecated

Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
