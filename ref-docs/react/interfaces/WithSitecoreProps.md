[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / WithSitecoreProps

# Interface: WithSitecoreProps

Defined in: [packages/react/src/enhancers/withSitecore.tsx:17](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/react/src/enhancers/withSitecore.tsx#L17)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/enhancers/withSitecore.tsx:25](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/react/src/enhancers/withSitecore.tsx#L25)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/enhancers/withSitecore.tsx:21](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/react/src/enhancers/withSitecore.tsx#L21)

The current page context.

***

### updatePage?

> `optional` **updatePage**: `false` \| (`value`) => `void`

Defined in: [packages/react/src/enhancers/withSitecore.tsx:31](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/react/src/enhancers/withSitecore.tsx#L31)

Method to update the page. This is only available if `updatable` is set to true.

#### Param

New page value.

#### Returns
