[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [i18n](../README.md) / DictionaryService

# Interface: DictionaryService

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:70](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/core/src/i18n/graphql-dictionary-service.ts#L70)

Service that fetches dictionary data using Sitecore's GraphQL API.

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`language`, `site`?, `fetchOptions`?): `Promise`\<[`DictionaryPhrases`](DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:76](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/core/src/i18n/graphql-dictionary-service.ts#L76)

Fetch dictionary data for a language.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | the language to be used to fetch the dictionary |
| `site`? | `string` | site name to fetch data for. |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | - |

#### Returns

`Promise`\<[`DictionaryPhrases`](DictionaryPhrases.md)\>
