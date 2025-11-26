[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig** = `object`

Defined in: [packages/core/src/tools/generateSites.ts:17](https://github.com/Sitecore/content-sdk/blob/65b824ad50a7283719a2d728d11f015787868529/packages/core/src/tools/generateSites.ts#L17)

Configuration object for generating sites.

## Properties

### destinationPath?

> `optional` **destinationPath**: `string`

Defined in: [packages/core/src/tools/generateSites.ts:28](https://github.com/Sitecore/content-sdk/blob/65b824ad50a7283719a2d728d11f015787868529/packages/core/src/tools/generateSites.ts#L28)

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

***

### ~~scConfig?~~

> `optional` **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [packages/core/src/tools/generateSites.ts:22](https://github.com/Sitecore/content-sdk/blob/65b824ad50a7283719a2d728d11f015787868529/packages/core/src/tools/generateSites.ts#L22)

The Sitecore configuration used at build and run time.

#### Deprecated

Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
