[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / JsonLdSchema

# Variable: JsonLdSchema

> `const` **JsonLdSchema**: (`{ page }`) => `JSX.Element` \| `null`

Defined in: react/types/components/JsonLdSchema.d.ts:23

Renders a single `<script type="application/ld+json">` tag containing all JSON-LD structured
data schemas from a Sitecore route (`sitecore.context.schemas`), serialized as a JSON array.
Renders nothing if there are no schemas, or if the page isn't in normal (rendering) mode — for
example while in Pages/Experience Editor or Preview, so structured data isn't injected around
unpublished/editing chrome. Framework-agnostic — the tag doesn't need to live inside `<head>`
for structured data to be discovered by crawlers, so it can be rendered anywhere in the tree
(e.g. nested inside `next/head`'s `<Head>` for Pages Router, or directly in a Next.js App
Router Server Component).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `{ page }` | [`JsonLdSchemaProps`](../interfaces/JsonLdSchemaProps.md) |

## Returns

`JSX.Element` \| `null`
