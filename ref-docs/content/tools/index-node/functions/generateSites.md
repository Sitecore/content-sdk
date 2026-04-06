[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / generateSites

# Function: generateSites()

> **generateSites**(`config`): (`args`) => `Promise`\<`void`\>

Defined in: [content/src/tools/generateSites.ts:32](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/content/src/tools/generateSites.ts#L32)

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
| `args` | \{ `scConfig`: [`SitecoreConfig`](../../../config/type-aliases/SitecoreConfig.md); \} |
| `args.scConfig` | [`SitecoreConfig`](../../../config/type-aliases/SitecoreConfig.md) |

### Returns

`Promise`\<`void`\>
