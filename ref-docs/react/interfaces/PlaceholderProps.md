[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / PlaceholderProps

# Interface: PlaceholderProps

Defined in: [packages/react/src/components/Placeholder/models.ts:17](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L17)

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### componentLoadingMessage?

> `optional` **componentLoadingMessage**: `string`

Defined in: [packages/react/src/components/Placeholder/models.ts:74](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L74)

The message that gets displayed while component is loading

***

### componentMap?

> `optional` **componentMap**: [`ComponentMap`](../type-aliases/ComponentMap.md)

Defined in: [packages/react/src/components/Placeholder/models.ts:28](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L28)

Component Map will be used to map Sitecore component names to app implementation
When rendered within a <SitecoreProvider> component, defaults to the context componentMap.
When rendered as a server placeholder, this prop must be provided.

***

### disableSuspense?

> `optional` **disableSuspense**: `boolean`

Defined in: [packages/react/src/components/Placeholder/models.ts:79](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L79)

If true, disables Suspense in ErrorBoundary for the placeholder.

#### Default

```ts
false
```

***

### errorComponent?

> `optional` **errorComponent**: `ComponentClass`\<`ErrorComponentProps`, `any`\> \| `FC`\<`ErrorComponentProps`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:65](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L65)

A component that is rendered in place of the placeholder when an error occurs rendering
the placeholder

***

### fields?

> `optional` **fields**: `object`

Defined in: [packages/react/src/components/Placeholder/models.ts:33](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L33)

An object of field names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.fields`.

#### Index Signature

\[`name`: `string`\]: [`Field`](Field.md)\<`GenericFieldValue`\> \| [`Item`](Item.md) \| [`Item`](Item.md)[]

***

### hiddenRenderingComponent?

> `optional` **hiddenRenderingComponent**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:59](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L59)

A component that is rendered in place of any components that are hidden

***

### missingComponentComponent?

> `optional` **missingComponentComponent**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:54](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L54)

A component that is rendered in place of any components that are in this placeholder,
but do not have a definition in the componentMap (i.e. don't have a React implementation)

***

### modifyComponentProps()?

> `optional` **modifyComponentProps**: (`componentProps`) => `ComponentProps`

Defined in: [packages/react/src/components/Placeholder/models.ts:49](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L49)

Modify final props of component (before render) provided by rendering data.
Can be used in case when you need to insert additional data into the component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentProps` | `ComponentProps` | component props to be modified |

#### Returns

`ComponentProps`

modified or initial props

***

### name

> **name**: `string`

Defined in: [packages/react/src/components/Placeholder/models.ts:20](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L20)

Name of the placeholder to render.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/Placeholder/models.ts:70](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L70)

Page data.
This data is passed by the SitecoreProvider.

***

### params?

> `optional` **params**: `object`

Defined in: [packages/react/src/components/Placeholder/models.ts:40](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L40)

An object of rendering parameter names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.params`.

#### Index Signature

\[`name`: `string`\]: `string`

***

### render()?

> `optional` **render**: (`components`, `data`, `props`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:88](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L88)

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

### renderEach()?

> `optional` **renderEach**: (`component`, `index`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:98](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L98)

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

### renderEmpty()?

> `optional` **renderEmpty**: (`components`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:83](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L83)

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

Defined in: [packages/react/src/components/Placeholder/models.ts:22](https://github.com/Sitecore/content-sdk/blob/257d1c870bd759124711aaafa802b560060fbd91/packages/react/src/components/Placeholder/models.ts#L22)

Rendering data to be used when rendering the placeholder.
