[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:36](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/react/src/components/SitecoreProvider.tsx#L36)

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api?**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \} \| `undefined`\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:58](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/react/src/components/SitecoreProvider.tsx#L58)

The API configuration defined in the `SitecoreConfig`.

***

### componentMap

> **componentMap**: [`ComponentMap`](../type-aliases/ComponentMap.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:54](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/react/src/components/SitecoreProvider.tsx#L54)

The component map to use for rendering components.

***

### loadImportMap

> **loadImportMap**: () => `Promise`\<[`ImportMapImport`](../type-aliases/ImportMapImport.md)\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:50](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/react/src/components/SitecoreProvider.tsx#L50)

The dynamic import for import map to be used in variant generation mode.

#### Returns

`Promise`\<[`ImportMapImport`](../type-aliases/ImportMapImport.md)\>

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:46](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/react/src/components/SitecoreProvider.tsx#L46)

The page data.

***

### setPage?

> `optional` **setPage?**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:42](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/react/src/components/SitecoreProvider.tsx#L42)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
