[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [browser](../README.md) / CloudSDKBrowserInitializer

# Class: CloudSDKBrowserInitializer

Defined in: [src/initializer/browser/initializer.ts:25](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/analytics-core/src/initializer/browser/initializer.ts#L25)

## Constructors

### Constructor

> **new CloudSDKBrowserInitializer**(`settings`): `CloudSDKBrowserInitializer`

Defined in: [src/initializer/browser/initializer.ts:34](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/analytics-core/src/initializer/browser/initializer.ts#L34)

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

Defined in: [src/initializer/browser/initializer.ts:44](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/analytics-core/src/initializer/browser/initializer.ts#L44)

Runs the initialization logic. Enables packages and create cookies for CloudSDK.

#### Returns

`void`
