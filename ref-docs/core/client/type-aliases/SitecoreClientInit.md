[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitecoreClientInit

# Type Alias: SitecoreClientInit

> **SitecoreClientInit** = `Omit`\<[`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md), `"multisite"` \| `"redirects"` \| `"personalize"`\> & `object`

Defined in: [packages/core/src/client/models.ts:11](https://github.com/Sitecore/content-sdk/blob/f2cd850e72d7bab103943f06c0941474a092fc1b/packages/core/src/client/models.ts#L11)

Init options for Sitecore Client that allows you to override services too

## Type declaration

### custom?

> `optional` **custom**: `object`

#### custom.componentService?

> `optional` **componentService**: [`RestComponentLayoutService`](../../editing/classes/RestComponentLayoutService.md)

#### custom.dictionaryService?

> `optional` **dictionaryService**: [`GraphQLDictionaryService`](../../i18n/classes/GraphQLDictionaryService.md)

#### custom.editingService?

> `optional` **editingService**: [`GraphQLEditingService`](../../editing/classes/GraphQLEditingService.md)

#### custom.errorPagesService?

> `optional` **errorPagesService**: [`GraphQLErrorPagesService`](../../site/classes/GraphQLErrorPagesService.md)

#### custom.layoutService?

> `optional` **layoutService**: [`GraphQLLayoutService`](../../layout/classes/GraphQLLayoutService.md)

#### custom.sitePathService?

> `optional` **sitePathService**: [`GraphQLSitePathService`](../../site/classes/GraphQLSitePathService.md)

#### custom.siteResolver?

> `optional` **siteResolver**: [`SiteResolver`](../../site/classes/SiteResolver.md)

### sites

> **sites**: [`SiteInfo`](../../site/type-aliases/SiteInfo.md)[]
