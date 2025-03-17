[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutRequestParams

# Interface: ComponentLayoutRequestParams

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:50](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L50)

Params for requesting component data from service in Component Library mode

## Properties

### componentUid

> **componentUid**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:59](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L59)

Component identifier. Can be either taken from item's layout details or
an arbitrary one (component renderingId and datasource would be used for identification then)

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:67](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L67)

optional component datasource

***

### editMode?

> `optional` **editMode**: [`Metadata`](../../layout/enumerations/EditMode.md#metadata)

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:79](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L79)

edit mode to be rendered component in. Component is rendered in normal mode by default

***

### itemId

> **itemId**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:54](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L54)

Item id to be used as context for rendering the component

***

### language?

> `optional` **language**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:63](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L63)

language to render component in

***

### renderingId?

> `optional` **renderingId**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:71](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L71)

ID of the component definition rendering item in Sitecore

***

### siteName?

> `optional` **siteName**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:83](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L83)

site name to be used as context for rendering the component

***

### version?

> `optional` **version**: `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:75](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/core/src/editing/rest-component-layout-service.ts#L75)

version of the context item (latest by default)
