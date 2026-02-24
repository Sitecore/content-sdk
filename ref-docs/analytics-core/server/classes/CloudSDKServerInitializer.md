[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [server](../README.md) / CloudSDKServerInitializer

# Class: CloudSDKServerInitializer

Defined in: [src/initializer/server/initializer.ts:39](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/analytics-core/src/initializer/server/initializer.ts#L39)

## Constructors

### Constructor

> **new CloudSDKServerInitializer**(`request`, `response`, `settings`): `CloudSDKServerInitializer`

Defined in: [src/initializer/server/initializer.ts:52](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/analytics-core/src/initializer/server/initializer.ts#L52)

Runs the initialization logic. Enables packages and creates cookies for CloudSDK.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | The request object, either a Middleware Request or an HTTP Request. |
| `response` | `Response` | The response object, either a Middleware Next Response or an HTTP Response. |
| `settings` | `ServerSettings` | Common settings for the CloudSDK. |

#### Returns

`CloudSDKServerInitializer`

#### Throws

ErrorMessages.MV_0001

#### Throws

ErrorMessages.MV_0002

#### Throws

ErrorMessages.IV_0001

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [src/initializer/server/initializer.ts:63](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/analytics-core/src/initializer/server/initializer.ts#L63)

Runs the initialization logic. Enables packages and create cookies for CloudSDK.

#### Returns

`Promise`\<`void`\>
