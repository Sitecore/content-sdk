[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / buildFallbackConfig

# Function: buildFallbackConfig()

> **buildFallbackConfig**(`env`): [`SitecoreConfig`](../type-aliases/SitecoreConfig.md)

Defined in: [content/src/config/define-config.ts:19](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/content/src/config/define-config.ts#L19)

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
