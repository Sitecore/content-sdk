[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [browser](../README.md) / CloudSDKBrowserInitializer

# Class: CloudSDKBrowserInitializer

Defined in: [src/initializer/browser/initializer.ts:25](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/analytics-core/src/initializer/browser/initializer.ts#L25)

## Constructors

### Constructor

> **new CloudSDKBrowserInitializer**(`settings`): `CloudSDKBrowserInitializer`

Defined in: [src/initializer/browser/initializer.ts:34](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/analytics-core/src/initializer/browser/initializer.ts#L34)

Runs the initialization logic. Enables packages and creates cookies for CloudSDK.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `settings` | [`BrowserSettings`](../../internal/interfaces/BrowserSettings.md) | Common settings for the CloudSDK. |

#### Returns

`CloudSDKBrowserInitializer`

#### Throws

ErrorMessages.MV_0001

#### Throws

ErrorMessages.MV_0002

#### Throws

ErrorMessages.IE_0001

#### Throws

ErrorMessages.IV_0001

## Methods

### initialize()

> **initialize**(): `void`

Defined in: [src/initializer/browser/initializer.ts:44](https://github.com/Sitecore/content-sdk/blob/da3af374c12a806fb6f8807e6b8d4e5bb6a4d421/packages/analytics-core/src/initializer/browser/initializer.ts#L44)

Runs the initialization logic. Enables packages and create cookies for CloudSDK.

#### Returns

`void`
