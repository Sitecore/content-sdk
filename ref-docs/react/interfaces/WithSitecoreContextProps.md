[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / WithSitecoreContextProps

# Interface: WithSitecoreContextProps

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:14](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/react/src/enhancers/withSitecoreContext.tsx#L14)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge`: `Required`\<\{ `clientContextId`: `string`; `contextId`: `string`; `edgeUrl`: `string`; \}\>; `local`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path`: `string`; \}\>; \}\>

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:16](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/react/src/enhancers/withSitecoreContext.tsx#L16)

***

### sitecoreContext

> **sitecoreContext**: [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:15](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/react/src/enhancers/withSitecoreContext.tsx#L15)

***

### updateSitecoreContext?

> `optional` **updateSitecoreContext**: `false` \| (`value`) => `void`

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:17](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/react/src/enhancers/withSitecoreContext.tsx#L17)
