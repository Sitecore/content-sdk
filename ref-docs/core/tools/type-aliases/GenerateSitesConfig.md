[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig** = `object`

Defined in: [packages/core/src/tools/generateSites.ts:16](https://github.com/Sitecore/content-sdk/blob/8c53a853d75603d20d15cb340986939d03d331f2/packages/core/src/tools/generateSites.ts#L16)

Configuration object for generating sites.

## Properties

### destinationPath?

> `optional` **destinationPath**: `string`

Defined in: [packages/core/src/tools/generateSites.ts:27](https://github.com/Sitecore/content-sdk/blob/8c53a853d75603d20d15cb340986939d03d331f2/packages/core/src/tools/generateSites.ts#L27)

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

***

### ~~scConfig?~~

> `optional` **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [packages/core/src/tools/generateSites.ts:21](https://github.com/Sitecore/content-sdk/blob/8c53a853d75603d20d15cb340986939d03d331f2/packages/core/src/tools/generateSites.ts#L21)

The Sitecore configuration used at build and run time.

#### Deprecated

Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
