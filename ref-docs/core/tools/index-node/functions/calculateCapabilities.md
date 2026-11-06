[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / calculateCapabilities

# Function: calculateCapabilities()

> **calculateCapabilities**(`config?`): `Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

Defined in: [packages/core/src/tools/capabilities/index.ts:313](https://github.com/Sitecore/content-sdk/blob/b124678d1f36578713f38271906f1e3a623ad001/packages/core/src/tools/capabilities/index.ts#L313)

Calculates enabled capabilities for an application.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | \{ `appInputs?`: `Record`\<`string`, `unknown`\>; `appRoot?`: `string`; `sitecoreConfig?`: [`CapabilitySitecoreConfig`](../../../index/type-aliases/CapabilitySitecoreConfig.md); \} | calculation configuration |
| `config.appInputs?` | `Record`\<`string`, `unknown`\> | custom application inputs for capability resolution |
| `config.appRoot?` | `string` | application root |
| `config.sitecoreConfig?` | [`CapabilitySitecoreConfig`](../../../index/type-aliases/CapabilitySitecoreConfig.md) | resolved Sitecore configuration |

## Returns

`Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

enabled capability keys
