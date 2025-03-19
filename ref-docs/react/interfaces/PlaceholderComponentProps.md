[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / PlaceholderComponentProps

# Interface: PlaceholderComponentProps

Defined in: [packages/react/src/components/Placeholder.tsx:8](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/Placeholder.tsx#L8)

## Extends

- `PlaceholderProps`

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### componentFactory?

> `optional` **componentFactory**: [`ComponentFactory`](../type-aliases/ComponentFactory.md)

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:43](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L43)

A factory function that will receive a componentName and return an instance of a React component.
When rendered within a <SitecoreContext> component, defaults to the context componentFactory.

#### Inherited from

`PlaceholderProps.componentFactory`

***

### componentLoadingMessage?

> `optional` **componentLoadingMessage**: `string`

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:88](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L88)

The message that gets displayed while component is loading

#### Inherited from

`PlaceholderProps.componentLoadingMessage`

***

### errorComponent?

> `optional` **errorComponent**: `ComponentClass`\<`ErrorComponentProps`\> \| `FC`\<`ErrorComponentProps`\>

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:80](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L80)

A component that is rendered in place of the placeholder when an error occurs rendering
the placeholder

#### Inherited from

`PlaceholderProps.errorComponent`

***

### fields?

> `optional` **fields**: `object`

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:48](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L48)

An object of field names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.fields`.

#### Index Signature

\[`name`: `string`\]: [`Field`](Field.md) \| [`Item`](Item.md) \| [`Item`](Item.md)[]

#### Inherited from

`PlaceholderProps.fields`

***

### hiddenRenderingComponent?

> `optional` **hiddenRenderingComponent**: `ComponentClass`\<`unknown`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:74](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L74)

A component that is rendered in place of any components that are hidden

#### Inherited from

`PlaceholderProps.hiddenRenderingComponent`

***

### missingComponentComponent?

> `optional` **missingComponentComponent**: `ComponentClass`\<`unknown`\> \| `FC`\<`unknown`\>

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:69](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L69)

A component that is rendered in place of any components that are in this placeholder,
but do not have a definition in the componentFactory (i.e. don't have a React implementation)

#### Inherited from

`PlaceholderProps.missingComponentComponent`

***

### modifyComponentProps()?

> `optional` **modifyComponentProps**: (`componentProps`) => `ComponentProps`

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:64](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L64)

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

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:36](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L36)

Name of the placeholder to render.

#### Inherited from

`PlaceholderProps.name`

***

### params?

> `optional` **params**: `object`

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:55](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L55)

An object of rendering parameter names/values that are aggregated and propagated through the component tree created by a placeholder.
Any component or placeholder rendered by a placeholder will have access to this data via `props.params`.

#### Index Signature

\[`name`: `string`\]: `string`

#### Inherited from

`PlaceholderProps.params`

***

### render()?

> `optional` **render**: (`components`, `data`, `props`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder.tsx:17](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/Placeholder.tsx#L17)

Render props function that enables control over the rendering of the components in the placeholder.
Useful for techniques like wrapping each child in a wrapper component.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | `ReactNode`[] |
| `data` | [`ComponentRendering`](ComponentRendering.md)[] |
| `props` | `PlaceholderProps` |

#### Returns

`ReactNode`

***

### renderEach()?

> `optional` **renderEach**: (`component`, `index`) => `ReactNode`

Defined in: [packages/react/src/components/Placeholder.tsx:27](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/Placeholder.tsx#L27)

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

Defined in: [packages/react/src/components/Placeholder.tsx:12](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/Placeholder.tsx#L12)

Render props function that is called when the placeholder contains no content components.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | `ReactNode`[] |

#### Returns

`ReactNode`

***

### rendering

> **rendering**: [`RouteData`](RouteData.md) \| [`ComponentRendering`](ComponentRendering.md)

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:38](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L38)

Rendering data to be used when rendering the placeholder.

#### Inherited from

`PlaceholderProps.rendering`

***

### sitecoreContext

> **sitecoreContext**: [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

Defined in: [packages/react/src/components/PlaceholderCommon.tsx:84](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/react/src/components/PlaceholderCommon.tsx#L84)

Context data from the Sitecore Layout Service

#### Inherited from

`PlaceholderProps.sitecoreContext`
