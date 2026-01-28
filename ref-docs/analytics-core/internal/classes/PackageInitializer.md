[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / PackageInitializer

# Class: PackageInitializer

Defined in: [src/initializer/browser/package-initializer.ts:9](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/analytics-core/src/initializer/browser/package-initializer.ts#L9)

Package initializer for browser environments.
This class is used by other packages to plugin to the core CloudSDK initializer.
It manages package dependencies, initialization state, and side effects execution.

## Constructors

### Constructor

> **new PackageInitializer**(`packageContext`): `PackageInitializer`

Defined in: [src/initializer/browser/package-initializer.ts:19](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/analytics-core/src/initializer/browser/package-initializer.ts#L19)

Creates a new PackageInitializer instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `packageContext` | `PackageContext` | The package context containing side effects, settings, and dependencies. |

#### Returns

`PackageInitializer`

## Accessors

### initState

#### Get Signature

> **get** **initState**(): `Promise`\<`void`\> \| `null`

Defined in: [src/initializer/browser/package-initializer.ts:29](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/analytics-core/src/initializer/browser/package-initializer.ts#L29)

Gets the initialization state promise.

##### Returns

`Promise`\<`void`\> \| `null`

The initialization state promise or null if not started.

***

### settings

#### Get Signature

> **get** **settings**(): `unknown`

Defined in: [src/initializer/browser/package-initializer.ts:37](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/analytics-core/src/initializer/browser/package-initializer.ts#L37)

Gets the package-specific settings.

##### Returns

`unknown`

The package settings.

## Methods

### exec()

> **exec**(): `void`

Defined in: [src/initializer/browser/package-initializer.ts:45](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/analytics-core/src/initializer/browser/package-initializer.ts#L45)

Executes the package initialization.
Validates dependencies and wraps side effects execution.

#### Returns

`void`
