[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / generateSites

# Function: generateSites()

> **generateSites**(`config`): (`args`) => `Promise`\<`void`\>

Defined in: [content/src/tools/generateSites.ts:30](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/content/src/tools/generateSites.ts#L30)

Generates site information and writes it to a specified destination path.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GenerateSitesConfig`](../type-aliases/GenerateSitesConfig.md) | The configuration for generating site info. |

## Returns

- A promise that resolves to an asynchronous function that fetches site information and writes it to a file.

> (`args`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | \{ `scConfig`: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md); \} |
| `args.scConfig` | [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md) |

### Returns

`Promise`\<`void`\>
