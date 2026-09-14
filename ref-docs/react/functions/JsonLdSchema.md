[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / JsonLdSchema

# Function: JsonLdSchema()

> **JsonLdSchema**(`props`): `Element` \| `null`

Defined in: [packages/react/src/components/JsonLdSchema.tsx:26](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/react/src/components/JsonLdSchema.tsx#L26)

Renders a single `<script type="application/ld+json">` tag containing all JSON-LD structured
data schemas from a Sitecore route (`sitecore.context.schemas`), serialized as a JSON array.
Renders nothing if there are no schemas, or if the page isn't in normal (rendering) mode — for
example while in Pages/Experience Editor or Preview, so structured data isn't injected around
unpublished/editing chrome. Framework-agnostic — the tag doesn't need to live inside `<head>`
for structured data to be discovered by crawlers, so it can be rendered anywhere in the tree
(e.g. nested inside `next/head`'s `<Head>` for Pages Router, or directly in a Next.js App
Router Server Component).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`JsonLdSchemaProps`](../interfaces/JsonLdSchemaProps.md) | Component props. |

## Returns

`Element` \| `null`
