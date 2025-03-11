[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateSitesConfig

# Type Alias: GenerateSitesConfig

> **GenerateSitesConfig**: `object`

Defined in: [packages/core/src/tools/generateSites.ts:13](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/tools/generateSites.ts#L13)

Configuration object for generating sites.

## Type declaration

### defaultSite

> **defaultSite**: [`SiteInfo`](../../site/type-aliases/SiteInfo.md)

The default site name.

### destinationPath?

> `optional` **destinationPath**: `string`

Optional path where the generated sites will be saved.
If not provided, the default '.sitecore/sites.json' will be used.

### multisiteEnabled

> **multisiteEnabled**: `boolean`

Indicates if multisite support is enabled.

### siteInfoService

> **siteInfoService**: [`GraphQLSiteInfoService`](../../site/classes/GraphQLSiteInfoService.md)

The SiteInfo service.
