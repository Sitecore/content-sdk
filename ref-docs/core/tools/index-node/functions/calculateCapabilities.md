[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / calculateCapabilities

# Function: calculateCapabilities()

> **calculateCapabilities**(`config?`): `Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

Defined in: [packages/core/src/tools/capabilities/index.ts:313](https://github.com/Sitecore/content-sdk/blob/17c91dd6a59e449fbba2c70048fe1b4ce6a5fb72/packages/core/src/tools/capabilities/index.ts#L313)

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
