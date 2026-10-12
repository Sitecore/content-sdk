[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / SitecoreClientInit

# Type Alias: SitecoreClientInit

> **SitecoreClientInit** = `Omit`\<[`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md), `"multisite"` \| `"redirects"` \| `"personalize"`\> & `object`

Defined in: [content/src/client/models.ts:12](https://github.com/Sitecore/content-sdk/blob/d153ea0b9ebac2083b9f58f493cfe6e81e7b4fb0/packages/content/src/client/models.ts#L12)

Init options for Sitecore Client that allows you to override services too

## Type Declaration

### custom?

> `optional` **custom?**: `object`

#### custom.componentService?

> `optional` **componentService?**: [`ComponentLayoutService`](../../editing/classes/ComponentLayoutService.md)

#### custom.dictionaryService?

> `optional` **dictionaryService?**: [`DictionaryService`](../../i18n/classes/DictionaryService.md)

#### custom.editingService?

> `optional` **editingService?**: [`EditingService`](../../editing/classes/EditingService.md)

#### custom.errorPagesService?

> `optional` **errorPagesService?**: [`ErrorPagesService`](../../site/classes/ErrorPagesService.md)

#### custom.layoutService?

> `optional` **layoutService?**: [`LayoutService`](../../layout/classes/LayoutService.md)

#### custom.sitePathService?

> `optional` **sitePathService?**: [`SitePathService`](../../site/classes/SitePathService.md)
