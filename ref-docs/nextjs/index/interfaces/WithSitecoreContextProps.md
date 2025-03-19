[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / WithSitecoreContextProps

# Interface: WithSitecoreContextProps

Defined in: react/types/enhancers/withSitecoreContext.d.ts:7

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge`: `Required`\<`undefined` \| \{ `clientContextId`: `string`; `contextId`: `string`; `edgeUrl`: `string`; \}\>; `local`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path`: `string`; \}\>; \}\>

Defined in: react/types/enhancers/withSitecoreContext.d.ts:9

***

### sitecoreContext

> **sitecoreContext**: [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

Defined in: react/types/enhancers/withSitecoreContext.d.ts:8

***

### updateSitecoreContext?

> `optional` **updateSitecoreContext**: `false` \| (`value`) => `void`

Defined in: react/types/enhancers/withSitecoreContext.d.ts:10
