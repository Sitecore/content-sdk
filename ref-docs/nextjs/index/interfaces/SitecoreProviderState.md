[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: react/types/components/SitecoreProvider.d.ts:36

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api?**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \} \| `undefined`\>; \}\>

Defined in: react/types/components/SitecoreProvider.d.ts:62

The API configuration defined in the `SitecoreConfig`.

***

### atomsConfig?

> `optional` **atomsConfig?**: [`AtomsConfig`](../../atoms/interfaces/AtomsConfig.md)

Defined in: react/types/components/SitecoreProvider.d.ts:54

Atoms runtime: catalog and registry for rendering low-code components.

***

### componentMap

> **componentMap**: [`ComponentMap`](../type-aliases/ComponentMap.md)

Defined in: react/types/components/SitecoreProvider.d.ts:58

The component map to use for rendering components.

***

### loadImportMap

> **loadImportMap**: () => `Promise`\<`ImportMapImport`\>

Defined in: react/types/components/SitecoreProvider.d.ts:50

The dynamic import for import map to be used in variant generation mode.

#### Returns

`Promise`\<`ImportMapImport`\>

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: react/types/components/SitecoreProvider.d.ts:46

The page data.

***

### setPage?

> `optional` **setPage?**: (`value`) => `void`

Defined in: react/types/components/SitecoreProvider.d.ts:42

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
