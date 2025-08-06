[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / PlaceholderComponentProps

# Interface: PlaceholderComponentProps

<<<<<<< HEAD
Defined in: [packages/react/src/components/Placeholder.tsx:8](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Placeholder.tsx#L8)
=======
Defined in: [packages/react/src/components/Placeholder.tsx:8](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Placeholder.tsx#L8)
>>>>>>> dd686bb50 (Update API docs)

## Extends

- `PlaceholderProps`

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### componentLoadingMessage?

> `optional` **componentLoadingMessage**: `string`

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:88](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L88)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:88](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L88)
>>>>>>> dd686bb50 (Update API docs)

The message that gets displayed while component is loading

#### Inherited from

`PlaceholderProps.componentLoadingMessage`

***

### componentMap?

> `optional` **componentMap**: [`ComponentMap`](../type-aliases/ComponentMap.md)

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:42](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L42)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:42](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L42)
>>>>>>> dd686bb50 (Update API docs)

Component Map will be used to map Sitecore component names to app implementation
When rendered within a <SitecoreProvider> component, defaults to the context componentMap.

#### Inherited from

`PlaceholderProps.componentMap`

***

### disableSuspense?

> `optional` **disableSuspense**: `boolean`

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:93](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L93)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:93](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L93)
>>>>>>> dd686bb50 (Update API docs)

If true, disables Suspense in ErrorBoundary for the placeholder.

#### Default

```ts
false
```

#### Inherited from

`PlaceholderProps.disableSuspense`

***

### errorComponent?

> `optional` **errorComponent**: `ComponentClass`\<`ErrorComponentProps`, `any`\> \| `FC`\<`ErrorComponentProps`\>

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:79](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L79)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:79](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L79)
>>>>>>> dd686bb50 (Update API docs)

A component that is rendered in place of the placeholder when an error occurs rendering
the placeholder

#### Inherited from

`PlaceholderProps.errorComponent`

***

### fields?

> `optional` **fields**: `object`

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:47](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L47)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:47](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L47)
>>>>>>> dd686bb50 (Update API docs)

An object of field names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.fields`.

#### Index Signature

\[`name`: `string`\]: [`Field`](Field.md)\<`GenericFieldValue`\> \| [`Item`](Item.md) \| [`Item`](Item.md)[]

#### Inherited from

`PlaceholderProps.fields`

***

### hiddenRenderingComponent?

> `optional` **hiddenRenderingComponent**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:73](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L73)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:73](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L73)
>>>>>>> dd686bb50 (Update API docs)

A component that is rendered in place of any components that are hidden

#### Inherited from

`PlaceholderProps.hiddenRenderingComponent`

***

### missingComponentComponent?

> `optional` **missingComponentComponent**: `ComponentClass`\<`unknown`, `any`\> \| `FC`\<`unknown`\>

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:68](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L68)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:68](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L68)
>>>>>>> dd686bb50 (Update API docs)

A component that is rendered in place of any components that are in this placeholder,
but do not have a definition in the componentMap (i.e. don't have a React implementation)

#### Inherited from

`PlaceholderProps.missingComponentComponent`

***

### modifyComponentProps()?

> `optional` **modifyComponentProps**: (`componentProps`) => `ComponentProps`

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:63](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L63)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:63](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L63)
>>>>>>> dd686bb50 (Update API docs)

Modify final props of component (before render) provided by rendering data.
Can be used in case when you need to insert additional data into the component.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentProps` | `ComponentProps` | component props to be modified |

#### Returns

`ComponentProps`

modified or initial props

#### Inherited from

`PlaceholderProps.modifyComponentProps`

***

### name

> **name**: `string`

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:35](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L35)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:35](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L35)
>>>>>>> dd686bb50 (Update API docs)

Name of the placeholder to render.

#### Inherited from

`PlaceholderProps.name`

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:84](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L84)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:84](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L84)
>>>>>>> dd686bb50 (Update API docs)

Page data.
This data is passed by the SitecoreProvider.

#### Inherited from

`PlaceholderProps.page`

***

### params?

> `optional` **params**: `object`

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:54](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L54)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:54](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L54)
>>>>>>> dd686bb50 (Update API docs)

An object of rendering parameter names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.params`.

#### Index Signature

\[`name`: `string`\]: `string`

#### Inherited from

`PlaceholderProps.params`

***

### render()?

> `optional` **render**: (`components`, `data`, `props`) => `ReactNode`

<<<<<<< HEAD
Defined in: [packages/react/src/components/Placeholder.tsx:17](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Placeholder.tsx#L17)
=======
Defined in: [packages/react/src/components/Placeholder.tsx:17](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Placeholder.tsx#L17)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/react/src/components/Placeholder.tsx:27](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Placeholder.tsx#L27)
=======
Defined in: [packages/react/src/components/Placeholder.tsx:27](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Placeholder.tsx#L27)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/react/src/components/Placeholder.tsx:12](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/Placeholder.tsx#L12)
=======
Defined in: [packages/react/src/components/Placeholder.tsx:12](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/Placeholder.tsx#L12)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:37](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/components/PlaceholderCommon.tsx#L37)
=======
Defined in: [packages/react/src/components/PlaceholderCommon.tsx:37](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/components/PlaceholderCommon.tsx#L37)
>>>>>>> dd686bb50 (Update API docs)

Rendering data to be used when rendering the placeholder.

#### Inherited from

`PlaceholderProps.rendering`
