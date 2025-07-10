[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:25](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/react/src/components/SitecoreProvider.tsx#L25)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:39](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/react/src/components/SitecoreProvider.tsx#L39)

The API configuration defined in the `SitecoreConfig`.

***

### pageContext

> **pageContext**: [`SitecoreProviderPageContext`](../type-aliases/SitecoreProviderPageContext.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:35](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/react/src/components/SitecoreProvider.tsx#L35)

The current page context.

***

### setContext()

> **setContext**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:31](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/react/src/components/SitecoreProvider.tsx#L31)

Method to set the page context.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`LayoutServiceData`](LayoutServiceData.md) \| [`SitecoreProviderPageContext`](../type-aliases/SitecoreProviderPageContext.md) | New page context value. |

#### Returns

`void`
