[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / getJsonLdSchemas

# Variable: getJsonLdSchemas

> `const` **getJsonLdSchemas**: (`schemas?`) => [`HTMLScript`](../type-aliases/HTMLScript.md) \| `null`

Defined in: content/types/layout/json-ld.d.ts:12

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

[`HTMLScript`](../type-aliases/HTMLScript.md) \| `null`

script tag data, or `null` if there are no schemas to render
