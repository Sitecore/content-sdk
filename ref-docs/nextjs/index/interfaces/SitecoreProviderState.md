[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: react/types/components/SitecoreProvider.d.ts:20

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<`undefined` \| \{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: react/types/components/SitecoreProvider.d.ts:34

The API configuration defined in the `SitecoreConfig`.

***

### pageContext

> **pageContext**: [`SitecoreProviderPageContext`](../type-aliases/SitecoreProviderPageContext.md)

Defined in: react/types/components/SitecoreProvider.d.ts:30

The current page context.

***

### setContext()

> **setContext**: (`value`) => `void`

Defined in: react/types/components/SitecoreProvider.d.ts:26

Method to set the page context.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`LayoutServiceData`](LayoutServiceData.md) \| [`SitecoreProviderPageContext`](../type-aliases/SitecoreProviderPageContext.md) | New page context value. |

#### Returns

`void`
