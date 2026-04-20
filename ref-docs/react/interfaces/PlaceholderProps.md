[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / PlaceholderProps

# Interface: PlaceholderProps

Defined in: [packages/react/src/components/Placeholder/models.ts:17](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L17)

Base Placeholder props

## Properties

### componentLoadingMessage?

> `optional` **componentLoadingMessage?**: `string`

Defined in: [packages/react/src/components/Placeholder/models.ts:61](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L61)

The message that gets displayed while component is loading

***

### componentMap?

> `optional` **componentMap?**: [`ComponentMap`](../type-aliases/ComponentMap.md)

Defined in: [packages/react/src/components/Placeholder/models.ts:112](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L112)

Component Map will be used to map Sitecore component names to app implementation
When rendered within a <SitecoreProvider> component, defaults to the context componentMap.
When rendered as a server placeholder, this prop must be provided. This prop is not used in AppPlaceholder.

***

### ~~disableSuspense?~~

> `optional` **disableSuspense?**: `boolean`

Defined in: [packages/react/src/components/Placeholder/models.ts:69](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L69)

#### Deprecated

The `disableSuspense` prop is deprecated and will be removed in version 3.0.0.
The default value is set to `true` to avoid forcing Suspense usage across all components which could negatively impact performance metrics. Suspense can now be enabled explicitly when needed.

If `false`, enables Suspense in ErrorBoundary for the components rendered by placeholder.

#### Default

```ts
true
```

***

### errorComponent?

> `optional` **errorComponent?**: `ComponentClass`\<`ErrorComponentProps`, `any`\> \| `FC`\<`ErrorComponentProps`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:52](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L52)

A component that is rendered in place of the placeholder when an error occurs rendering
the placeholder

***

### fields?

> `optional` **fields?**: `object`

Defined in: [packages/react/src/components/Placeholder/models.ts:26](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L26)

An object of field names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.fields`.

#### Index Signature

\[`name`: `string`\]: [`Field`](Field.md)\<`GenericFieldValue`\> \| [`Item`](Item.md) \| [`Item`](Item.md)[]

***

### hiddenRenderingComponent?

> `optional` **hiddenRenderingComponent?**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:46](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L46)

A component that is rendered in place of any components that are hidden

***

### missingComponentComponent?

> `optional` **missingComponentComponent?**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:41](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L41)

A component that is rendered in place of any components that are in this placeholder,
but do not have a definition in the componentMap (i.e. don't have a React implementation)

***

### modifyComponentProps?

> `optional` **modifyComponentProps?**: (`componentProps`) => `ChildComponentProps`

Defined in: [packages/react/src/components/Placeholder/models.ts:96](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L96)

Modify final props of component (before render) provided by rendering data.
Can be used in case when you need to insert additional data into the component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentProps` | `ChildComponentProps` | component props to be modified |

#### Returns

`ChildComponentProps`

modified or initial props

***

### name

> **name**: `string`

Defined in: [packages/react/src/components/Placeholder/models.ts:19](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L19)

Name of the placeholder to render.

***

### page?

> `optional` **page?**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/Placeholder/models.ts:57](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L57)

Page data.
This data is passed by the SitecoreProvider.

***

### params?

> `optional` **params?**: `object`

Defined in: [packages/react/src/components/Placeholder/models.ts:33](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L33)

An object of rendering parameter names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.params`.

#### Index Signature

\[`name`: `string`\]: `string`

***

### passThroughComponentProps?

> `optional` **passThroughComponentProps?**: `object`

Defined in: [packages/react/src/components/Placeholder/models.ts:103](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L103)

An alternative to `modifyComponentProps` that allows passing additional props to the component without modifying the CSDK Placeholder props from Sitecore.
These props will be merged into the result of modifyComponentProps if you use both
Make sure to not include non-serializable props here in RSC server context https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values

#### Index Signature

\[`key`: `string`\]: `unknown`

***

### render?

> `optional` **render?**: (`components`, `data`, `props`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:84](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L84)

Render props function that enables control over the rendering of the components in the placeholder.
Useful for techniques like wrapping each child in a wrapper component.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | `ReactNode`[] |
| `data` | [`ComponentRendering`](ComponentRendering.md)\<[`ComponentFields`](ComponentFields.md)\>[] |
| `props` | `PlaceholderProps` |

#### Returns

`ReactNode`

***

### renderEach?

> `optional` **renderEach?**: (`component`, `index`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:79](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L79)

Render props function that is called for each non-system component added to the placeholder.
Mutually exclusive with `render`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `component` | `ReactNode` |
| `index` | `number` |

#### Returns

`ReactNode`

***

### renderEmpty?

> `optional` **renderEmpty?**: (`components`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:73](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L73)

Render props function that is called when the placeholder contains no content components.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | `ReactNode`[] |

#### Returns

`ReactNode`

***

### rendering

> **rendering**: [`ComponentRendering`](ComponentRendering.md)\<[`ComponentFields`](ComponentFields.md)\> \| [`RouteData`](RouteData.md)\<`Record`\<`string`, [`Field`](Field.md)\<`GenericFieldValue`\> \| [`Item`](Item.md) \| [`Item`](Item.md)[]\>\>

Defined in: [packages/react/src/components/Placeholder/models.ts:21](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/react/src/components/Placeholder/models.ts#L21)

Rendering data to be used when rendering the placeholder.
