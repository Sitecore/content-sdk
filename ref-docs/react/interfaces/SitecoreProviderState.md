[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:36](https://github.com/Sitecore/content-sdk/blob/f50ad68591b7b5a53e2085990d302267e3320840/packages/react/src/components/SitecoreProvider.tsx#L36)

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:50](https://github.com/Sitecore/content-sdk/blob/f50ad68591b7b5a53e2085990d302267e3320840/packages/react/src/components/SitecoreProvider.tsx#L50)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:46](https://github.com/Sitecore/content-sdk/blob/f50ad68591b7b5a53e2085990d302267e3320840/packages/react/src/components/SitecoreProvider.tsx#L46)

The current page.

***

### setPage()

> **setPage**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:42](https://github.com/Sitecore/content-sdk/blob/f50ad68591b7b5a53e2085990d302267e3320840/packages/react/src/components/SitecoreProvider.tsx#L42)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
