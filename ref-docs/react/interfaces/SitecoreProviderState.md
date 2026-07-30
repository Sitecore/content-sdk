[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / SitecoreProviderState

# Interface: SitecoreProviderState

Defined in: [packages/react/src/components/SitecoreProvider.tsx:42](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/react/src/components/SitecoreProvider.tsx#L42)

The state for the SitecoreProvider component.

## Properties

### api?

> `optional` **api?**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \} \| `undefined`\>; \}\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:68](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/react/src/components/SitecoreProvider.tsx#L68)

The API configuration defined in the `SitecoreConfig`.

***

### atomsConfig?

> `optional` **atomsConfig?**: [`AtomsConfig`](AtomsConfig.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:60](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/react/src/components/SitecoreProvider.tsx#L60)

Atoms runtime: catalog and registry for rendering low-code components.

***

### componentMap

> **componentMap**: [`ComponentMap`](../type-aliases/ComponentMap.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:64](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/react/src/components/SitecoreProvider.tsx#L64)

The component map to use for rendering components.

***

### loadImportMap

> **loadImportMap**: () => `Promise`\<[`ImportMapImport`](../type-aliases/ImportMapImport.md)\>

Defined in: [packages/react/src/components/SitecoreProvider.tsx:56](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/react/src/components/SitecoreProvider.tsx#L56)

The dynamic import for import map to be used in variant generation mode.

#### Returns

`Promise`\<[`ImportMapImport`](../type-aliases/ImportMapImport.md)\>

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:52](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/react/src/components/SitecoreProvider.tsx#L52)

The page data.

***

### setPage?

> `optional` **setPage?**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreProvider.tsx:48](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/react/src/components/SitecoreProvider.tsx#L48)

Method to set the page.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Page`](../type-aliases/Page.md) | New page value. |

#### Returns

`void`
