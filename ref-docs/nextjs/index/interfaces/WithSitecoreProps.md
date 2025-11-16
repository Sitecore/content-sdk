[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / WithSitecoreProps

# Interface: WithSitecoreProps

Defined in: react/types/enhancers/withSitecore.d.ts:19

The props that HOC will inject.

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<`undefined` \| \{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: react/types/enhancers/withSitecore.d.ts:27

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: react/types/enhancers/withSitecore.d.ts:23

The current page context.

***

### updatePage?

> `optional` **updatePage**: `false` \| (`value`) => `void`

Defined in: react/types/enhancers/withSitecore.d.ts:33

Method to update the page. This is only available if `updatable` is set to true.

#### Param

New page value.

#### Returns
