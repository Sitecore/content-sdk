[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [i18n](../README.md) / DictionaryService

# Interface: DictionaryService

Defined in: [packages/core/src/i18n/dictionary-service.ts:13](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/i18n/dictionary-service.ts#L13)

Service that fetches dictionary data using Sitecore's GraphQL API.

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`language`): `Promise`\<[`DictionaryPhrases`](DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/dictionary-service.ts:18](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/i18n/dictionary-service.ts#L18)

Fetch dictionary data for a language.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | the language to be used to fetch the dictionary |

#### Returns

`Promise`\<[`DictionaryPhrases`](DictionaryPhrases.md)\>
