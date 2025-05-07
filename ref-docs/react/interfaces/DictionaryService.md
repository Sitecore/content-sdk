[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DictionaryService

# Interface: DictionaryService

Defined in: packages/core/types/i18n/graphql-dictionary-service.d.ts:37

Service that fetches dictionary data using Sitecore's GraphQL API.

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`language`, `site`?, `fetchOptions`?): `Promise`\<[`DictionaryPhrases`](DictionaryPhrases.md)\>

Defined in: packages/core/types/i18n/graphql-dictionary-service.d.ts:43

Fetch dictionary data for a language.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | the language to be used to fetch the dictionary |
| `site`? | `string` | site name to fetch data for. |
| `fetchOptions`? | `FetchOptions` | - |

#### Returns

`Promise`\<[`DictionaryPhrases`](DictionaryPhrases.md)\>
