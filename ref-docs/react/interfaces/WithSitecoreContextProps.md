[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / WithSitecoreContextProps

# Interface: WithSitecoreContextProps

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:14](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/react/src/enhancers/withSitecoreContext.tsx#L14)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:16](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/react/src/enhancers/withSitecoreContext.tsx#L16)

***

### sitecoreContext

> **sitecoreContext**: [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:15](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/react/src/enhancers/withSitecoreContext.tsx#L15)

***

### updateSitecoreContext?

> `optional` **updateSitecoreContext**: `false` \| (`value`) => `void`

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:17](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/react/src/enhancers/withSitecoreContext.tsx#L17)
