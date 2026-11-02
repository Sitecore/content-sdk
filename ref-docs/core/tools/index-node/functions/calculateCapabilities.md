[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / calculateCapabilities

# Function: calculateCapabilities()

> **calculateCapabilities**(`config?`): `Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

Defined in: [packages/core/src/tools/capabilities/index.ts:299](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/core/src/tools/capabilities/index.ts#L299)

Calculates enabled capabilities for an application.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | \{ `appRoot?`: `string`; `sitecoreConfig?`: [`CapabilitySitecoreConfig`](../../../index/type-aliases/CapabilitySitecoreConfig.md); \} | calculation configuration |
| `config.appRoot?` | `string` | application root |
| `config.sitecoreConfig?` | [`CapabilitySitecoreConfig`](../../../index/type-aliases/CapabilitySitecoreConfig.md) | resolved Sitecore configuration |

## Returns

`Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

enabled capability keys
