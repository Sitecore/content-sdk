[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getJsonLdSchemas

# Function: getJsonLdSchemas()

> **getJsonLdSchemas**(`schemas?`): [`HTMLScript`](../../index/type-aliases/HTMLScript.md) \| `null`

Defined in: [content/src/layout/json-ld.ts:50](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/content/src/layout/json-ld.ts#L50)

Builds the `<script type="application/ld+json">` data for the JSON-LD structured data
schemas returned by the Sitecore Layout Service (`sitecore.context.schemas`), for
consumption by any rendering layer (Next.js, React, Angular, etc). All schema objects
are serialized into a single script as a JSON array. Invalid entries (`null`, `undefined`,
arrays, or other non-object values) are filtered out before serialization.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `schemas?` | `Record`\<`string`, `unknown`\>[] \| `null` | JSON-LD schema node objects (e.g. `sitecore.context.schemas`) |

## Returns

[`HTMLScript`](../../index/type-aliases/HTMLScript.md) \| `null`

script tag data, or `null` if there are no schemas to render
