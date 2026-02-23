[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutServiceConfig

# Interface: ComponentLayoutServiceConfig

Defined in: [packages/core/src/editing/component-layout-service.ts:58](https://github.com/Sitecore/content-sdk/blob/0136d0acb2e8346bcb52e2d0dca5714ba8c61735/packages/core/src/editing/component-layout-service.ts#L58)

Config for ComponentLayoutService.
Provide contextId (server) and optionally clientContextId (browser).

## Properties

### clientContextId?

> `optional` **clientContextId**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:62](https://github.com/Sitecore/content-sdk/blob/0136d0acb2e8346bcb52e2d0dca5714ba8c61735/packages/core/src/editing/component-layout-service.ts#L62)

A unified identifier used to connect and retrieve data from XM Cloud instance used on the client

***

### contextId

> **contextId**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:66](https://github.com/Sitecore/content-sdk/blob/0136d0acb2e8346bcb52e2d0dca5714ba8c61735/packages/core/src/editing/component-layout-service.ts#L66)

A unified identifier used to connect and retrieve data from XM Cloud instance used on the server

***

### edgeUrl?

> `optional` **edgeUrl**: `string`

Defined in: [packages/core/src/editing/component-layout-service.ts:71](https://github.com/Sitecore/content-sdk/blob/0136d0acb2e8346bcb52e2d0dca5714ba8c61735/packages/core/src/editing/component-layout-service.ts#L71)

XM Cloud endpoint that the app will communicate and retrieve data from

#### Default

```ts
https://edge-platform.sitecorecloud.io
```
