[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / WithSitecoreProps

# Interface: WithSitecoreProps

Defined in: [packages/react/src/enhancers/withSitecore.tsx:18](https://github.com/Sitecore/content-sdk/blob/6568f3f866052357cc0d19dd77254f43ff7c7f0a/packages/react/src/enhancers/withSitecore.tsx#L18)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/enhancers/withSitecore.tsx:26](https://github.com/Sitecore/content-sdk/blob/6568f3f866052357cc0d19dd77254f43ff7c7f0a/packages/react/src/enhancers/withSitecore.tsx#L26)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/enhancers/withSitecore.tsx:22](https://github.com/Sitecore/content-sdk/blob/6568f3f866052357cc0d19dd77254f43ff7c7f0a/packages/react/src/enhancers/withSitecore.tsx#L22)

The current page context.

***

### updatePage?

> `optional` **updatePage**: `false` \| (`value`) => `void`

Defined in: [packages/react/src/enhancers/withSitecore.tsx:32](https://github.com/Sitecore/content-sdk/blob/6568f3f866052357cc0d19dd77254f43ff7c7f0a/packages/react/src/enhancers/withSitecore.tsx#L32)

Method to update the page. This is only available if `updatable` is set to true.

#### Param

New page value.

#### Returns
