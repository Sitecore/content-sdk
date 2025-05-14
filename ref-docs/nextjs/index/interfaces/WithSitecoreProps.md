[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / WithSitecoreProps

# Interface: WithSitecoreProps

Defined in: react/types/enhancers/withSitecore.d.ts:10

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<`undefined` \| \{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: react/types/enhancers/withSitecore.d.ts:18

The API configuration defined in the `SitecoreConfig`.

***

### pageContext

> **pageContext**: [`SitecoreProviderPageContext`](../type-aliases/SitecoreProviderPageContext.md)

Defined in: react/types/enhancers/withSitecore.d.ts:14

The current page context.

***

### updateContext?

> `optional` **updateContext**: `false` \| (`value`) => `void`

Defined in: react/types/enhancers/withSitecore.d.ts:24

Method to update the page context. This is only available if `updatable` is set to true.

#### Param

New page context value.

#### Returns
