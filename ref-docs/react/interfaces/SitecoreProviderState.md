[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:34](https://github.com/Sitecore/content-sdk/blob/ecba2755393ad3977546ad3dd9af18483599661e/packages/react/src/components/SitecoreProvider.tsx#L34)

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api?**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \} \| `undefined`\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:56](https://github.com/Sitecore/content-sdk/blob/ecba2755393ad3977546ad3dd9af18483599661e/packages/react/src/components/SitecoreProvider.tsx#L56)

The API configuration defined in the `SitecoreConfig`.

***

### componentMap

> **componentMap**: [`ComponentMap`](../type-aliases/ComponentMap.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:52](https://github.com/Sitecore/content-sdk/blob/ecba2755393ad3977546ad3dd9af18483599661e/packages/react/src/components/SitecoreProvider.tsx#L52)

The component map to use for rendering components.

***

### loadImportMap

> **loadImportMap**: () => `Promise`\<[`ImportMapImport`](../type-aliases/ImportMapImport.md)\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:48](https://github.com/Sitecore/content-sdk/blob/ecba2755393ad3977546ad3dd9af18483599661e/packages/react/src/components/SitecoreProvider.tsx#L48)

The dynamic import for import map to be used in variant generation mode.

#### Returns

`Promise`\<[`ImportMapImport`](../type-aliases/ImportMapImport.md)\>

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:44](https://github.com/Sitecore/content-sdk/blob/ecba2755393ad3977546ad3dd9af18483599661e/packages/react/src/components/SitecoreProvider.tsx#L44)

The page data.

***

### setPage?

> `optional` **setPage?**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:40](https://github.com/Sitecore/content-sdk/blob/ecba2755393ad3977546ad3dd9af18483599661e/packages/react/src/components/SitecoreProvider.tsx#L40)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
