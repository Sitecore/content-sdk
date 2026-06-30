[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / ComponentLayoutRequestParams

# Interface: ComponentLayoutRequestParams

Defined in: [content/src/editing/component-layout-service.ts:13](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L13)

Params for requesting component data in Design Library mode

## Properties

### componentUid

> **componentUid**: `string`

Defined in: [content/src/editing/component-layout-service.ts:22](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L22)

Component identifier. Can be either taken from item's layout details or
an arbitrary one (component renderingId and datasource would be used for identification then)

***

### dataSourceId?

> `optional` **dataSourceId?**: `string`

Defined in: [content/src/editing/component-layout-service.ts:34](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L34)

optional component datasource

***

### generation?

> `optional` **generation?**: [`Variant`](../enumerations/DesignLibraryVariantGeneration.md#variant)

Defined in: [content/src/editing/component-layout-service.ts:50](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L50)

design library variant generation mode

***

### itemId

> **itemId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:17](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L17)

Item id to be used as context for rendering the component

***

### language?

> `optional` **language?**: `string`

Defined in: [content/src/editing/component-layout-service.ts:30](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L30)

language to render component in

***

### mode?

> `optional` **mode?**: [`DesignLibraryMode`](../enumerations/DesignLibraryMode.md)

Defined in: [content/src/editing/component-layout-service.ts:46](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L46)

mode to be used for rendering the component

***

### renderingId?

> `optional` **renderingId?**: `string`

Defined in: [content/src/editing/component-layout-service.ts:38](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L38)

ID of the component definition rendering item in Sitecore

***

### siteName

> **siteName**: `string`

Defined in: [content/src/editing/component-layout-service.ts:26](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L26)

site name to be used as context for rendering the component

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/editing/component-layout-service.ts:42](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/content/src/editing/component-layout-service.ts#L42)

version of the context item (latest by default)
