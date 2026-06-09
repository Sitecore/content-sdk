[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config-cli](../README.md) / defineCliConfig

# Function: defineCliConfig()

> **defineCliConfig**(`cliConfig`): [`SitecoreCliConfig`](../content/config/type-aliases/SitecoreCliConfig.md)

Defined in: [packages/angular/src/config-cli/define-cli-config.ts:70](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/config-cli/define-cli-config.ts#L70)

Accepts a [SitecoreCliConfigInput](../content/config/type-aliases/SitecoreCliConfigInput.md) and returns CLI configuration with Angular defaults
(component map generator, optional build/scaffold placeholders), then applies core validation.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cliConfig` | [`AngularCsdkCliConfig`](../type-aliases/AngularCsdkCliConfig.md) | CLI configuration from `sitecore.cli.config.ts` |

## Returns

[`SitecoreCliConfig`](../content/config/type-aliases/SitecoreCliConfig.md)

Resolved [SitecoreCliConfig](../content/config/type-aliases/SitecoreCliConfig.md)
