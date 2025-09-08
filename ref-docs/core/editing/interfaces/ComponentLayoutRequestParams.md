[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutRequestParams

# Interface: ComponentLayoutRequestParams

Defined in: [packages/core/src/editing/component-layout-service.ts:12](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L12)

Params for requesting component data in Design Library mode

## Properties

### componentUid

> **componentUid**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:21](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L21)

Component identifier. Can be either taken from item's layout details or
an arbitrary one (component renderingId and datasource would be used for identification then)

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:29](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L29)

optional component datasource

***

### itemId

> **itemId**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:16](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L16)

Item id to be used as context for rendering the component

***

### language?

> `optional` **language**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:25](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L25)

language to render component in

***

### mode?

> `optional` **mode**: [`DesignLibraryMode`](../enumerations/DesignLibraryMode.md)

Defined in: [packages/core/src/editing/component-layout-service.ts:45](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L45)

mode to be used for rendering the component

***

### renderingId?

> `optional` **renderingId**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:33](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L33)

ID of the component definition rendering item in Sitecore

***

### siteName

> **siteName**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:41](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L41)

site name to be used as context for rendering the component

***

### version?

> `optional` **version**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:37](https://github.com/Sitecore/content-sdk/blob/03264144042ad781def9f7c0b968ddb525b3de97/packages/core/src/editing/component-layout-service.ts#L37)

version of the context item (latest by default)
