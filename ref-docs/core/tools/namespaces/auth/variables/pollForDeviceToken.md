[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / pollForDeviceToken

# Variable: pollForDeviceToken()

> **pollForDeviceToken**: (`params`) => `Promise`\<[`AuthResponse`](../../../interfaces/AuthResponse.md)\> = `_pollForDeviceToken`

Defined in: [packages/core/src/tools/auth/flow.ts:47](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/flow.ts#L47)

Polls the OAuth 2.0 device token endpoint to retrieve the access token once the user has authorized the device.
This is typically used to continue the device authorization process after a user enters a code on a browser.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`DeviceTokenPollRequest`](../../../interfaces/DeviceTokenPollRequest.md) | Parameters for polling including clientId, deviceCode, interval, and authority. |

## Returns

`Promise`\<[`AuthResponse`](../../../interfaces/AuthResponse.md)\>

A promise resolving to the device token response including access token and refresh token.

## Throws

If polling fails or exceeds the timeout period.
