[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingConfigMiddlewareConfig

# Type Alias: EditingConfigMiddlewareConfig

> **EditingConfigMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-config-middleware.ts:19](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/nextjs/src/editing/editing-config-middleware.ts#L19)

The interface for the EditingConfigMiddleware configuration.

## Properties

### components

> **components**: [`ComponentMap`](../../index/type-aliases/ComponentMap.md)\<[`NextjsContentSdkComponent`](../../index/type-aliases/NextjsContentSdkComponent.md)\>

Defined in: [nextjs/src/editing/editing-config-middleware.ts:23](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/nextjs/src/editing/editing-config-middleware.ts#L23)

Components available in the application

***

### metadata

> **metadata**: `Metadata`

Defined in: [nextjs/src/editing/editing-config-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/nextjs/src/editing/editing-config-middleware.ts#L27)

Application metadata

***

### theming?

> `optional` **theming?**: `object`

Defined in: [nextjs/src/editing/editing-config-middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/nextjs/src/editing/editing-config-middleware.ts#L31)

Design-token theming from `sitecore.config`. Exposed so Pages can detect feature compatibility.

#### mode?

> `optional` **mode?**: `ThemingMode`
