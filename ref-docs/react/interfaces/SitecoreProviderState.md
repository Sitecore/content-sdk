[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:36](https://github.com/Sitecore/content-sdk/blob/e860e313e1fd16b0af1abcbc0952ae7951f74946/packages/react/src/components/SitecoreProvider.tsx#L36)

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<`undefined` \| \{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:50](https://github.com/Sitecore/content-sdk/blob/e860e313e1fd16b0af1abcbc0952ae7951f74946/packages/react/src/components/SitecoreProvider.tsx#L50)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:46](https://github.com/Sitecore/content-sdk/blob/e860e313e1fd16b0af1abcbc0952ae7951f74946/packages/react/src/components/SitecoreProvider.tsx#L46)

The current page.

***

### setPage()

> **setPage**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:42](https://github.com/Sitecore/content-sdk/blob/e860e313e1fd16b0af1abcbc0952ae7951f74946/packages/react/src/components/SitecoreProvider.tsx#L42)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
