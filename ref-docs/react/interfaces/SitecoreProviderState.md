[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:25](https://github.com/Sitecore/content-sdk/blob/84a8656cae04ac3655132cd2077fbe5b8f878d16/packages/react/src/components/SitecoreProvider.tsx#L25)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:39](https://github.com/Sitecore/content-sdk/blob/84a8656cae04ac3655132cd2077fbe5b8f878d16/packages/react/src/components/SitecoreProvider.tsx#L39)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:35](https://github.com/Sitecore/content-sdk/blob/84a8656cae04ac3655132cd2077fbe5b8f878d16/packages/react/src/components/SitecoreProvider.tsx#L35)

The current page.

***

### setPage()

> **setPage**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:31](https://github.com/Sitecore/content-sdk/blob/84a8656cae04ac3655132cd2077fbe5b8f878d16/packages/react/src/components/SitecoreProvider.tsx#L31)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
