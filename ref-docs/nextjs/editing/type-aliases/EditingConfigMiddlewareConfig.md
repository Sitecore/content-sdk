[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingConfigMiddlewareConfig

# Type Alias: EditingConfigMiddlewareConfig

> **EditingConfigMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-config-middleware.ts:19](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/nextjs/src/editing/editing-config-middleware.ts#L19)

The interface for the EditingConfigMiddleware configuration.

## Properties

### components

> **components**: [`ComponentMap`](../../index/type-aliases/ComponentMap.md)\<[`NextjsContentSdkComponent`](../../index/type-aliases/NextjsContentSdkComponent.md)\>

Defined in: [nextjs/src/editing/editing-config-middleware.ts:23](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/nextjs/src/editing/editing-config-middleware.ts#L23)

Components available in the application

***

### metadata

> **metadata**: `Metadata`

Defined in: [nextjs/src/editing/editing-config-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/nextjs/src/editing/editing-config-middleware.ts#L27)

Application metadata

***

### theming?

> `optional` **theming?**: `object`

Defined in: [nextjs/src/editing/editing-config-middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/nextjs/src/editing/editing-config-middleware.ts#L31)

Design-token theming from `sitecore.config`. Exposed so Pages can detect feature compatibility.

#### mode?

> `optional` **mode?**: `ThemingMode`
