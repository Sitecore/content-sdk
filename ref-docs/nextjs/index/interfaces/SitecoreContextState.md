[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / SitecoreContextState

# Interface: SitecoreContextState

Defined in: react/types/components/SitecoreContext.d.ts:12

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge`: `Required`\<`undefined` \| \{ `clientContextId`: `string`; `contextId`: `string`; `edgeUrl`: `string`; \}\>; `local`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path`: `string`; \}\>; \}\>

Defined in: react/types/components/SitecoreContext.d.ts:15

***

### context

> **context**: [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

Defined in: react/types/components/SitecoreContext.d.ts:14

***

### setContext()

> **setContext**: (`value`) => `void`

Defined in: react/types/components/SitecoreContext.d.ts:13

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`LayoutServiceData`](LayoutServiceData.md) \| [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md) |

#### Returns

`void`
