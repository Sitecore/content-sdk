[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / buildFallbackConfig

# Function: buildFallbackConfig()

> **buildFallbackConfig**(`env`): [`SitecoreConfig`](../type-aliases/SitecoreConfig.md)

Defined in: [content/src/config/define-config.ts:19](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/content/src/config/define-config.ts#L19)

**`Internal`**

Default Sitecore config values sourced from an env-like record (e.g. `process.env` or
values mapped from an Angular `environment` object). Shared by [getFallbackConfig](getFallbackConfig.md)
and framework-specific define-config wrappers.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `env` | \{\[`key`: `string`\]: `string` \| `undefined`; \} | String key/value map using the same names as Node / Sitecore CLI env vars |

## Returns

[`SitecoreConfig`](../type-aliases/SitecoreConfig.md)

default config before merging `sitecore.config` overrides
