[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitecoreClientInit

# Type Alias: SitecoreClientInit

> **SitecoreClientInit** = `Omit`\<[`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md), `"multisite"` \| `"redirects"` \| `"personalize"`\> & `object`

Defined in: [packages/core/src/client/models.ts:11](https://github.com/Sitecore/content-sdk/blob/3b1b6ea0a30c0e87321117e7d5fb40b7ab02cba7/packages/core/src/client/models.ts#L11)

Init options for Sitecore Client that allows you to override services too

## Type declaration

### custom?

> `optional` **custom**: `object`

#### custom.componentService?

> `optional` **componentService**: [`ComponentLayoutService`](../../editing/classes/ComponentLayoutService.md)

#### custom.dictionaryService?

> `optional` **dictionaryService**: [`DictionaryService`](../../i18n/classes/DictionaryService.md)

#### custom.editingService?

> `optional` **editingService**: [`EditingService`](../../editing/classes/EditingService.md)

#### custom.errorPagesService?

> `optional` **errorPagesService**: [`ErrorPagesService`](../../site/classes/ErrorPagesService.md)

#### custom.layoutService?

> `optional` **layoutService**: [`LayoutService`](../../layout/classes/LayoutService.md)

#### custom.sitePathService?

> `optional` **sitePathService**: [`SitePathService`](../../site/classes/SitePathService.md)
