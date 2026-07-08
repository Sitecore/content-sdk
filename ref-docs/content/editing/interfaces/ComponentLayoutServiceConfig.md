[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / ComponentLayoutServiceConfig

# Interface: ComponentLayoutServiceConfig

Defined in: [content/src/editing/component-layout-service.ts:58](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/component-layout-service.ts#L58)

Config for ComponentLayoutService.
Provide contextId (server) and optionally clientContextId (browser).

## Properties

### clientContextId?

> `optional` **clientContextId?**: `string`

Defined in: [content/src/editing/component-layout-service.ts:62](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/component-layout-service.ts#L62)

A unified identifier used to connect and retrieve data from XM Cloud instance used on the client

***

### contextId

> **contextId**: `string`

Defined in: [content/src/editing/component-layout-service.ts:66](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/component-layout-service.ts#L66)

A unified identifier used to connect and retrieve data from XM Cloud instance used on the server

***

### edgeUrl?

> `optional` **edgeUrl?**: `string`

Defined in: [content/src/editing/component-layout-service.ts:71](https://github.com/Sitecore/content-sdk/blob/13f41bd2e6c114594096dffe00abf9fcf456f19f/packages/content/src/editing/component-layout-service.ts#L71)

XM Cloud endpoint that the app will communicate and retrieve data from

#### Default

```ts
https://edge-platform.sitecorecloud.io
```
