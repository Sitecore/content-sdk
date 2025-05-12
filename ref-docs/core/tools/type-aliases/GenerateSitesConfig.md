[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig** = `object`

Defined in: [packages/core/src/tools/generateSites.ts:15](https://github.com/Sitecore/xmc-jss-dev/blob/e071b5c5bcc29ad3f8f0d1250181261d976b39d1/packages/core/src/tools/generateSites.ts#L15)

Configuration object for generating sites.

## Properties

### destinationPath?

> `optional` **destinationPath**: `string`

Defined in: [packages/core/src/tools/generateSites.ts:25](https://github.com/Sitecore/xmc-jss-dev/blob/e071b5c5bcc29ad3f8f0d1250181261d976b39d1/packages/core/src/tools/generateSites.ts#L25)

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

***

### scConfig

> **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [packages/core/src/tools/generateSites.ts:19](https://github.com/Sitecore/xmc-jss-dev/blob/e071b5c5bcc29ad3f8f0d1250181261d976b39d1/packages/core/src/tools/generateSites.ts#L19)

The Sitecore configuration used at build and run time.
