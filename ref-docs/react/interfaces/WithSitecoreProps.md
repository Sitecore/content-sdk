[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / WithSitecoreProps

# Interface: WithSitecoreProps

Defined in: [packages/react/src/enhancers/withSitecore.tsx:17](https://github.com/Sitecore/content-sdk/blob/db0340f489a1a48fba3b33f286fdd6dc507466bf/packages/react/src/enhancers/withSitecore.tsx#L17)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/enhancers/withSitecore.tsx:25](https://github.com/Sitecore/content-sdk/blob/db0340f489a1a48fba3b33f286fdd6dc507466bf/packages/react/src/enhancers/withSitecore.tsx#L25)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/enhancers/withSitecore.tsx:21](https://github.com/Sitecore/content-sdk/blob/db0340f489a1a48fba3b33f286fdd6dc507466bf/packages/react/src/enhancers/withSitecore.tsx#L21)

The current page context.

***

### updatePage?

> `optional` **updatePage**: `false` \| (`value`) => `void`

Defined in: [packages/react/src/enhancers/withSitecore.tsx:31](https://github.com/Sitecore/content-sdk/blob/db0340f489a1a48fba3b33f286fdd6dc507466bf/packages/react/src/enhancers/withSitecore.tsx#L31)

Method to update the page. This is only available if `updatable` is set to true.

#### Param

New page value.

#### Returns
