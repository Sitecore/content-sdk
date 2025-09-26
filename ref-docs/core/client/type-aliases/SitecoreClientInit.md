[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitecoreClientInit

# Type Alias: SitecoreClientInit

> **SitecoreClientInit** = `Omit`\<[`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md), `"multisite"` \| `"redirects"` \| `"personalize"`\> & `object`

Defined in: [packages/core/src/client/models.ts:11](https://github.com/Sitecore/content-sdk/blob/e8b106f23eb416c3200d4f8e6db200c4a3f9f594/packages/core/src/client/models.ts#L11)

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
