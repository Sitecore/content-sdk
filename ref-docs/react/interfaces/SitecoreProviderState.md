[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:29](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/react/src/components/SitecoreProvider.tsx#L29)

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:43](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/react/src/components/SitecoreProvider.tsx#L43)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:39](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/react/src/components/SitecoreProvider.tsx#L39)

The current page.

***

### setPage()

> **setPage**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:35](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/react/src/components/SitecoreProvider.tsx#L35)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
