[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [index](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**(`config?`, `env?`): [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [content/src/config/define-config.ts:260](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/content/src/config/define-config.ts#L260)

Accepts a SitecoreConfigInput object and returns full sitecore configuration

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`SitecoreConfigInput`](../../config/type-aliases/SitecoreConfigInput.md) | override values to be written over default config settings |
| `env?` | `Record`\<`string`, `string` \| `undefined`\> | optional env-like record to source default config values from; defaults to `process.env` when not provided |

## Returns

[`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

full sitecore configuration to use in application
