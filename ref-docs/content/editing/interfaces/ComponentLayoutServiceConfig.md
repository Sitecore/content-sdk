[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / ComponentLayoutServiceConfig

# Interface: ComponentLayoutServiceConfig

Defined in: [content/src/editing/component-layout-service.ts:56](https://github.com/Sitecore/content-sdk/blob/4124a8307b50372705f15f5d57a92b7358748ad1/packages/content/src/editing/component-layout-service.ts#L56)

Config for ComponentLayoutService.
Provide contextId (server) and optionally clientContextId (browser).

## Properties

### clientContextId?

> `optional` **clientContextId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:60](https://github.com/Sitecore/content-sdk/blob/4124a8307b50372705f15f5d57a92b7358748ad1/packages/content/src/editing/component-layout-service.ts#L60)

A unified identifier used to connect and retrieve data from XM Cloud instance used on the client

***

### contextId

> **contextId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:64](https://github.com/Sitecore/content-sdk/blob/4124a8307b50372705f15f5d57a92b7358748ad1/packages/content/src/editing/component-layout-service.ts#L64)

A unified identifier used to connect and retrieve data from XM Cloud instance used on the server

***

### edgeUrl?

> `optional` **edgeUrl**: `string`

Defined in: [content/src/editing/component-layout-service.ts:69](https://github.com/Sitecore/content-sdk/blob/4124a8307b50372705f15f5d57a92b7358748ad1/packages/content/src/editing/component-layout-service.ts#L69)

XM Cloud endpoint that the app will communicate and retrieve data from

#### Default

```ts
https://edge-platform.sitecorecloud.io
```
