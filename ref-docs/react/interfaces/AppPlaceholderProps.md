[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AppPlaceholderProps

# Interface: AppPlaceholderProps

Defined in: [packages/react/src/components/Placeholder/models.ts:127](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L127)

The interface for the AppPlaceholder component props.

## Extends

- `BasePlaceholderProps`

## Properties

### componentLoadingMessage?

> `optional` **componentLoadingMessage**: `string`

Defined in: [packages/react/src/components/Placeholder/models.ts:73](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L73)

The message that gets displayed while component is loading

#### Inherited from

`BasePlaceholderProps.componentLoadingMessage`

***

### componentMap

> **componentMap**: [`ComponentMap`](../type-aliases/ComponentMap.md)

Defined in: [packages/react/src/components/Placeholder/models.ts:133](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L133)

Component Map will be used to map Sitecore component names to app implementation
When rendered within a <SitecoreProvider> component, defaults to the context componentMap.
When rendered as a server placeholder, this prop must be provided. This prop is not used in AppPlaceholder.

***

### disableSuspense?

> `optional` **disableSuspense**: `boolean`

Defined in: [packages/react/src/components/Placeholder/models.ts:78](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L78)

If true, disables Suspense in ErrorBoundary for the placeholder.

#### Default

```ts
false
```

#### Inherited from

`BasePlaceholderProps.disableSuspense`

***

### errorComponent?

> `optional` **errorComponent**: `ComponentClass`\<`ErrorComponentProps`, `any`\> \| `FC`\<`ErrorComponentProps`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:64](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L64)

A component that is rendered in place of the placeholder when an error occurs rendering
the placeholder

#### Inherited from

`BasePlaceholderProps.errorComponent`

***

### fields?

> `optional` **fields**: `object`

Defined in: [packages/react/src/components/Placeholder/models.ts:38](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L38)

An object of field names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.fields`.

#### Index Signature

\[`name`: `string`\]: [`Field`](Field.md)\<`GenericFieldValue`\> \| [`Item`](Item.md) \| [`Item`](Item.md)[]

#### Inherited from

`BasePlaceholderProps.fields`

***

### hiddenRenderingComponent?

> `optional` **hiddenRenderingComponent**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:58](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L58)

A component that is rendered in place of any components that are hidden

#### Inherited from

`BasePlaceholderProps.hiddenRenderingComponent`

***

### missingComponentComponent?

> `optional` **missingComponentComponent**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/Placeholder/models.ts:53](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L53)

A component that is rendered in place of any components that are in this placeholder,
but do not have a definition in the componentMap (i.e. don't have a React implementation)

#### Inherited from

`BasePlaceholderProps.missingComponentComponent`

***

### modifyComponentProps()?

> `optional` **modifyComponentProps**: (`componentProps`) => `AppComponentProps`

Defined in: [packages/react/src/components/Placeholder/models.ts:140](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L140)

Modify final props of component (before render) provided by rendering data.
Can be used in case when you need to insert additional data into the component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentProps` | `AppComponentProps` | component props to be modified |

#### Returns

`AppComponentProps`

modified or initial props

***

### name

> **name**: `string`

Defined in: [packages/react/src/components/Placeholder/models.ts:31](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L31)

Name of the placeholder to render.

#### Inherited from

`BasePlaceholderProps.name`

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/components/Placeholder/models.ts:69](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L69)

Page data.
This data is passed by the SitecoreProvider.

#### Inherited from

`BasePlaceholderProps.page`

***

### params?

> `optional` **params**: `object`

Defined in: [packages/react/src/components/Placeholder/models.ts:45](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L45)

An object of rendering parameter names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.params`.

#### Index Signature

\[`name`: `string`\]: `string`

#### Inherited from

`BasePlaceholderProps.params`

***

### render()?

> `optional` **render**: (`components`, `data`, `props`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:146](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L146)

Render props function that enables control over the rendering of the components in the placeholder.
Useful for techniques like wrapping each child in a wrapper component.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | `ReactNode`[] |
| `data` | [`ComponentRendering`](ComponentRendering.md)\<[`ComponentFields`](ComponentFields.md)\>[] |
| `props` | `AppPlaceholderProps` |

#### Returns

`ReactNode`

***

### renderEach()?

> `optional` **renderEach**: (`component`, `index`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:88](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L88)

Render props function that is called for each non-system component added to the placeholder.
Mutually exclusive with `render`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `component` | `ReactNode` |
| `index` | `number` |

#### Returns

`ReactNode`

#### Inherited from

`BasePlaceholderProps.renderEach`

***

### renderEmpty()?

> `optional` **renderEmpty**: (`components`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder/models.ts:82](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L82)

Render props function that is called when the placeholder contains no content components.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | `ReactNode`[] |

#### Returns

`ReactNode`

#### Inherited from

`BasePlaceholderProps.renderEmpty`

***

### rendering

> **rendering**: [`ComponentRendering`](ComponentRendering.md)\<[`ComponentFields`](ComponentFields.md)\> \| [`RouteData`](RouteData.md)\<`Record`\<`string`, [`Field`](Field.md)\<`GenericFieldValue`\> \| [`Item`](Item.md) \| [`Item`](Item.md)[]\>\>

Defined in: [packages/react/src/components/Placeholder/models.ts:33](https://github.com/Sitecore/content-sdk/blob/ea91bc6e3a48ca7ed8a8501af05b091b0de686ae/packages/react/src/components/Placeholder/models.ts#L33)

Rendering data to be used when rendering the placeholder.

#### Inherited from

`BasePlaceholderProps.rendering`
