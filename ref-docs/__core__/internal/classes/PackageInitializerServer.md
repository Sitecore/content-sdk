[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / PackageInitializerServer

# Class: PackageInitializerServer

Defined in: [src/initializer/server/package-initializer.ts:9](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/__core__/src/initializer/server/package-initializer.ts#L9)

Package initializer for server environments.
This class is used by other packages to plugin to the core CloudSDK initializer.
It manages package dependencies, settings, and side effects execution on the server.

## Constructors

### Constructor

> **new PackageInitializerServer**(`packageContext`): `PackageInitializerServer`

Defined in: [src/initializer/server/package-initializer.ts:17](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/__core__/src/initializer/server/package-initializer.ts#L17)

Creates a new PackageInitializerServer instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `packageContext` | `PackageContext` | The package context containing side effects, settings, and dependencies. |

#### Returns

`PackageInitializerServer`

## Accessors

### settings

#### Get Signature

> **get** **settings**(): `unknown`

Defined in: [src/initializer/server/package-initializer.ts:27](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/__core__/src/initializer/server/package-initializer.ts#L27)

Gets the package-specific settings.

##### Returns

`unknown`

The package settings.

## Methods

### exec()

> **exec**(): `Promise`\<`void`\>

Defined in: [src/initializer/server/package-initializer.ts:36](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/__core__/src/initializer/server/package-initializer.ts#L36)

Executes the package initialization.
Validates dependencies and executes side effects.

#### Returns

`Promise`\<`void`\>

A promise that resolves when initialization is complete.
