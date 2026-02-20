[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / ComponentLayoutServiceConfig

# Interface: ComponentLayoutServiceConfig

Defined in: [content/src/editing/component-layout-service.ts:56](https://github.com/Sitecore/content-sdk/blob/c14dbcaffe52a0b67733dc871014642ffd25da94/packages/content/src/editing/component-layout-service.ts#L56)

Config for ComponentLayoutService.
Provide contextId (server) and optionally clientContextId (browser).

## Properties

### clientContextId?

> `optional` **clientContextId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:60](https://github.com/Sitecore/content-sdk/blob/c14dbcaffe52a0b67733dc871014642ffd25da94/packages/content/src/editing/component-layout-service.ts#L60)

A unified identifier used to connect and retrieve data from XM Cloud instance used on the client

***

### contextId

> **contextId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:64](https://github.com/Sitecore/content-sdk/blob/c14dbcaffe52a0b67733dc871014642ffd25da94/packages/content/src/editing/component-layout-service.ts#L64)

A unified identifier used to connect and retrieve data from XM Cloud instance used on the server

***

### edgeUrl?

> `optional` **edgeUrl**: `string`

Defined in: [content/src/editing/component-layout-service.ts:69](https://github.com/Sitecore/content-sdk/blob/c14dbcaffe52a0b67733dc871014642ffd25da94/packages/content/src/editing/component-layout-service.ts#L69)

XM Cloud endpoint that the app will communicate and retrieve data from

#### Default

```ts
https://edge-platform.sitecorecloud.io
```
