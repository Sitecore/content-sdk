[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / ComponentLayoutRequestParams

# Interface: ComponentLayoutRequestParams

Defined in: [content/src/editing/component-layout-service.ts:11](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L11)

Params for requesting component data in Design Library mode

## Properties

### componentUid

> **componentUid**: `string`

Defined in: [content/src/editing/component-layout-service.ts:20](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L20)

Component identifier. Can be either taken from item's layout details or
an arbitrary one (component renderingId and datasource would be used for identification then)

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:32](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L32)

optional component datasource

***

### generation?

> `optional` **generation**: [`Variant`](../enumerations/DesignLibraryVariantGeneration.md#variant)

Defined in: [content/src/editing/component-layout-service.ts:48](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L48)

design library variant generation mode

***

### itemId

> **itemId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:15](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L15)

Item id to be used as context for rendering the component

***

### language?

> `optional` **language**: `string`

Defined in: [content/src/editing/component-layout-service.ts:28](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L28)

language to render component in

***

### mode?

> `optional` **mode**: [`DesignLibraryMode`](../enumerations/DesignLibraryMode.md)

Defined in: [content/src/editing/component-layout-service.ts:44](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L44)

mode to be used for rendering the component

***

### renderingId?

> `optional` **renderingId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:36](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L36)

ID of the component definition rendering item in Sitecore

***

### siteName

> **siteName**: `string`

Defined in: [content/src/editing/component-layout-service.ts:24](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L24)

site name to be used as context for rendering the component

***

### version?

> `optional` **version**: `string`

Defined in: [content/src/editing/component-layout-service.ts:40](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/content/src/editing/component-layout-service.ts#L40)

version of the context item (latest by default)
