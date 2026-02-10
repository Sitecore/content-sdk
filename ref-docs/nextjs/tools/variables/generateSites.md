[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / generateSites

# Variable: generateSites()

> `const` **generateSites**: (`{ destinationPath }?`) => (`args`) => `Promise`\<`void`\>

Defined in: content/types/tools/generateSites.d.ts:19

Generates site information and writes it to a specified destination path.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `{ destinationPath }?` | [`GenerateSitesConfig`](../type-aliases/GenerateSitesConfig.md) |

## Returns

- A promise that resolves to an asynchronous function that fetches site information and writes it to a file.

> (`args`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | \{ `scConfig`: `SitecoreConfig`; \} |
| `args.scConfig` | `SitecoreConfig` |

### Returns

`Promise`\<`void`\>
