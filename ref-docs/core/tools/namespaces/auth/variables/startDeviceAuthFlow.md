[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [tools](../../../README.md) / [auth](../README.md) / startDeviceAuthFlow

# Variable: startDeviceAuthFlow()

> **startDeviceAuthFlow**: (`params`) => `Promise`\<[`DeviceAuthResponse`](../../../interfaces/DeviceAuthResponse.md)\> = `_startDeviceAuthFlow`

Defined in: [packages/core/src/tools/auth/flow.ts:38](https://github.com/Sitecore/content-sdk/blob/dfabaa9ada9db515612e737f52c405833da25101/packages/core/src/tools/auth/flow.ts#L38)

Initiates the OAuth 2.0 Device Authorization flow by requesting a device and user code.
This flow is typically used by devices or CLI apps that cannot input credentials directly.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`DeviceAuthRequest`](../../../interfaces/DeviceAuthRequest.md) | Parameters including clientId, audience, authority, and baseUrl. |

## Returns

`Promise`\<[`DeviceAuthResponse`](../../../interfaces/DeviceAuthResponse.md)\>

A promise resolving to device authorization metadata needed for polling.

## Throws

If the device authorization request fails or returns an error response.
