[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config-cli](../README.md) / defineCliConfig

# Function: defineCliConfig()

> **defineCliConfig**(`cliConfig`): [`SitecoreCliConfig`](../content/config/type-aliases/SitecoreCliConfig.md)

Defined in: [packages/angular/src/config-cli/define-cli-config.ts:70](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/config-cli/define-cli-config.ts#L70)

Accepts a [SitecoreCliConfigInput](../content/config/type-aliases/SitecoreCliConfigInput.md) and returns CLI configuration with Angular defaults
(component map generator, optional build/scaffold placeholders), then applies core validation.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cliConfig` | [`AngularCsdkCliConfig`](../type-aliases/AngularCsdkCliConfig.md) | CLI configuration from `sitecore.cli.config.ts` |

## Returns

[`SitecoreCliConfig`](../content/config/type-aliases/SitecoreCliConfig.md)

Resolved [SitecoreCliConfig](../content/config/type-aliases/SitecoreCliConfig.md)
