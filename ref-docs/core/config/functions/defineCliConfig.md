[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / defineCliConfig

# Function: defineCliConfig()

> **defineCliConfig**(`cliConfig`): `Required`\<\{ `build`: `Required`\<`undefined` \| \{ `commands`: () => `Promise`\<`void`\>[]; \}\>; `scaffold`: `Required`\<`undefined` \| \{ `templates`: [`ScaffoldTemplate`](../type-aliases/ScaffoldTemplate.md)[]; \}\>; \}\>

Defined in: [packages/core/src/config/define-cli-config.ts:20](https://github.com/Sitecore/content-sdk/blob/470c7bb404154f6c8bab7ab8dcba5e4e665da1cc/packages/core/src/config/define-cli-config.ts#L20)

Accepts a `SitecoreCliConfigInput` object and returns Sitecore Content SDK CLI configuration, updated with required default values

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cliConfig` | [`SitecoreCliConfigInput`](../type-aliases/SitecoreCliConfigInput.md) | the cli configuration provided by the application |

## Returns

`Required`\<\{ `build`: `Required`\<`undefined` \| \{ `commands`: () => `Promise`\<`void`\>[]; \}\>; `scaffold`: `Required`\<`undefined` \| \{ `templates`: [`ScaffoldTemplate`](../type-aliases/ScaffoldTemplate.md)[]; \}\>; \}\>

full sitecore cli configuration to use with cli
