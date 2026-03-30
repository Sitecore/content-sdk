[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / generateSites

# Function: generateSites()

> **generateSites**(`config`): (`args`) => `Promise`\<`void`\>

Defined in: [content/src/tools/generateSites.ts:32](https://github.com/Sitecore/content-sdk/blob/f7008cbcc73e6353a120cb1ae2a37404f22abe9f/packages/content/src/tools/generateSites.ts#L32)

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
