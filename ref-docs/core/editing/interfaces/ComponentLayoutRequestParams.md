[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutRequestParams

# Interface: ComponentLayoutRequestParams

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:12](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L12)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:12](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L12)
>>>>>>> dd686bb50 (Update API docs)

Params for requesting component data in Design Library mode

## Properties

### componentUid

> **componentUid**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:21](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L21)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:21](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L21)
>>>>>>> dd686bb50 (Update API docs)

Component identifier. Can be either taken from item's layout details or
an arbitrary one (component renderingId and datasource would be used for identification then)

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:29](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L29)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:29](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L29)
>>>>>>> dd686bb50 (Update API docs)

optional component datasource

***

### itemId

> **itemId**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:16](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L16)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:16](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L16)
>>>>>>> dd686bb50 (Update API docs)

Item id to be used as context for rendering the component

***

### language?

> `optional` **language**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:25](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L25)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:25](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L25)
>>>>>>> dd686bb50 (Update API docs)

language to render component in

***

### mode?

> `optional` **mode**: [`DesignLibraryMode`](../enumerations/DesignLibraryMode.md)

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:45](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L45)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:45](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L45)
>>>>>>> dd686bb50 (Update API docs)

mode to be used for rendering the component

***

### renderingId?

> `optional` **renderingId**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:33](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L33)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:33](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L33)
>>>>>>> dd686bb50 (Update API docs)

ID of the component definition rendering item in Sitecore

***

### siteName

> **siteName**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:41](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L41)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:41](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L41)
>>>>>>> dd686bb50 (Update API docs)

site name to be used as context for rendering the component

***

### version?

> `optional` **version**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/editing/component-layout-service.ts:37](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/editing/component-layout-service.ts#L37)
=======
Defined in: [packages/core/src/editing/component-layout-service.ts:37](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/editing/component-layout-service.ts#L37)
>>>>>>> dd686bb50 (Update API docs)

version of the context item (latest by default)
