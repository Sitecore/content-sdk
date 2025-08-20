[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:24](https://github.com/Sitecore/content-sdk/blob/1aaf0d9ca07ce965a9f80c41f1fab0fa85aed97a/packages/react/src/components/SitecoreProvider.tsx#L24)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:38](https://github.com/Sitecore/content-sdk/blob/1aaf0d9ca07ce965a9f80c41f1fab0fa85aed97a/packages/react/src/components/SitecoreProvider.tsx#L38)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:34](https://github.com/Sitecore/content-sdk/blob/1aaf0d9ca07ce965a9f80c41f1fab0fa85aed97a/packages/react/src/components/SitecoreProvider.tsx#L34)

The current page.

***

### setPage()

> **setPage**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:30](https://github.com/Sitecore/content-sdk/blob/1aaf0d9ca07ce965a9f80c41f1fab0fa85aed97a/packages/react/src/components/SitecoreProvider.tsx#L30)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
