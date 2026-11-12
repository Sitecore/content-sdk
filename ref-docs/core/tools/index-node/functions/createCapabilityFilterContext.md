[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / createCapabilityFilterContext

# Function: createCapabilityFilterContext()

> **createCapabilityFilterContext**(`appRoot?`, `sitecoreConfig?`, `appInputs?`): [`CapabilityFilterContext`](../../../index/type-aliases/CapabilityFilterContext.md)

Defined in: [packages/core/src/tools/capabilities/index.ts:263](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/tools/capabilities/index.ts#L263)

**`Internal`**

Creates an application filesystem context for capability filters.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `appRoot?` | `string` | application root |
| `sitecoreConfig?` | [`CapabilitySitecoreConfig`](../../../index/type-aliases/CapabilitySitecoreConfig.md) | resolved Sitecore configuration |
| `appInputs?` | `Record`\<`string`, `unknown`\> | custom application inputs for capability resolution |

## Returns

[`CapabilityFilterContext`](../../../index/type-aliases/CapabilityFilterContext.md)

filter context
