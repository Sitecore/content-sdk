[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [client](../README.md) / SitecoreClientInit

# Type Alias: SitecoreClientInit

> **SitecoreClientInit** = `Omit`\<`SitecoreConfig`, `"multisite"` \| `"redirects"` \| `"personalize"`\> & `object`

Defined in: core/types/client/models.d.ts:10

Init options for Sitecore Client that allows you to override services too

## Type declaration

### custom?

> `optional` **custom**: `object`

#### custom.componentService?

> `optional` **componentService**: [`RestComponentLayoutService`](../../index/classes/RestComponentLayoutService.md)

#### custom.dictionaryService?

> `optional` **dictionaryService**: [`GraphQLDictionaryService`](../../index/classes/GraphQLDictionaryService.md)

#### custom.editingService?

> `optional` **editingService**: [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

#### custom.errorPagesService?

> `optional` **errorPagesService**: [`GraphQLErrorPagesService`](../../index/classes/GraphQLErrorPagesService.md)

#### custom.layoutService?

> `optional` **layoutService**: [`GraphQLLayoutService`](../../index/classes/GraphQLLayoutService.md)

#### custom.sitePathService?

> `optional` **sitePathService**: [`GraphQLSitePathService`](../../index/classes/GraphQLSitePathService.md)

#### custom.siteResolver?

> `optional` **siteResolver**: [`SiteResolver`](../../index/classes/SiteResolver.md)

### sites

> **sites**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]
