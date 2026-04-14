[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config-cli](../README.md) / defineCliConfig

# Function: defineCliConfig()

> **defineCliConfig**(`cliConfig`): [`SitecoreCliConfig`](../../config/type-aliases/SitecoreCliConfig.md)

Defined in: [content/src/config-cli/define-cli-config.ts:21](https://github.com/Sitecore/content-sdk/blob/70016491a49cd62f4c9a1f6cd5f5e859c138b42d/packages/content/src/config-cli/define-cli-config.ts#L21)

Accepts a `SitecoreCliConfigInput` object and returns Sitecore Content SDK CLI configuration, updated with required default values

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cliConfig` | [`SitecoreCliConfigInput`](../../config/type-aliases/SitecoreCliConfigInput.md) | the cli configuration provided by the application |

## Returns

[`SitecoreCliConfig`](../../config/type-aliases/SitecoreCliConfig.md)

full sitecore cli configuration to use with cli
