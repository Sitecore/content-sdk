[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:34](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/react/src/components/SitecoreProvider.tsx#L34)

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \} \| `undefined`\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:48](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/react/src/components/SitecoreProvider.tsx#L48)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:44](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/react/src/components/SitecoreProvider.tsx#L44)

The current page.

***

### setPage()

> **setPage**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:40](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/react/src/components/SitecoreProvider.tsx#L40)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
