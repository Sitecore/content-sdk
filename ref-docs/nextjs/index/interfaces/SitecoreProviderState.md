[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: react/types/components/SitecoreProvider.d.ts:24

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<`undefined` \| \{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: react/types/components/SitecoreProvider.d.ts:38

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: react/types/components/SitecoreProvider.d.ts:34

The current page.

***

### setPage()

> **setPage**: (`value`) => `void`

Defined in: react/types/components/SitecoreProvider.d.ts:30

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
