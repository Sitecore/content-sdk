[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreContextState

# Interface: SitecoreContextState

Defined in: [packages/react/src/components/SitecoreContext.tsx:17](https://github.com/Sitecore/xmc-jss-dev/blob/4bb0c106fa9ce4e75279e740372f54f09e5c8653/packages/react/src/components/SitecoreContext.tsx#L17)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge`: `Required`\<\{ `clientContextId`: `string`; `contextId`: `string`; `edgeUrl`: `string`; \}\>; `local`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path`: `string`; \}\>; \}\>

Defined in: [packages/react/src/components/SitecoreContext.tsx:20](https://github.com/Sitecore/xmc-jss-dev/blob/4bb0c106fa9ce4e75279e740372f54f09e5c8653/packages/react/src/components/SitecoreContext.tsx#L20)

***

### context

> **context**: [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

Defined in: [packages/react/src/components/SitecoreContext.tsx:19](https://github.com/Sitecore/xmc-jss-dev/blob/4bb0c106fa9ce4e75279e740372f54f09e5c8653/packages/react/src/components/SitecoreContext.tsx#L19)

***

### setContext()

> **setContext**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreContext.tsx:18](https://github.com/Sitecore/xmc-jss-dev/blob/4bb0c106fa9ce4e75279e740372f54f09e5c8653/packages/react/src/components/SitecoreContext.tsx#L18)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`LayoutServiceData`](LayoutServiceData.md) \| [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md) |

#### Returns

`void`
