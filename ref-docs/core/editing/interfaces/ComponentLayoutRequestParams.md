[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutRequestParams

# Interface: ComponentLayoutRequestParams

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:10](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L10)

Params for requesting component data from service in Design Library mode

## Properties

### componentUid

> **componentUid**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:19](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L19)

Component identifier. Can be either taken from item's layout details or
an arbitrary one (component renderingId and datasource would be used for identification then)

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:27](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L27)

optional component datasource

***

### itemId

> **itemId**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:14](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L14)

Item id to be used as context for rendering the component

***

### language?

> `optional` **language**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:23](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L23)

language to render component in

***

### renderingId?

> `optional` **renderingId**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:31](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L31)

ID of the component definition rendering item in Sitecore

***

### siteName

> **siteName**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:39](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L39)

site name to be used as context for rendering the component

***

### version?

> `optional` **version**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:35](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L35)

version of the context item (latest by default)
