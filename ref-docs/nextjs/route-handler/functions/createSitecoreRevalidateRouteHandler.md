[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createSitecoreRevalidateRouteHandler

# Function: createSitecoreRevalidateRouteHandler()

> **createSitecoreRevalidateRouteHandler**(`options?`): `object`

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:84](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L84)

Creates a single `POST` handler for `/api/revalidate` that consumes Sitecore Experience Edge / Content
Operations webhook bodies (and equivalent ad-hoc calls that reuse the same body shape).

The body is expected to be a JSON object that resolves to at least one Sitecore cache tag:

- **`updates[]`** — Sitecore publish-event rows. Each row's `identifier` (with `-media` / `-layout`
  suffix stripped) maps to an `sc:item:<id>:<locale>` tag, using `entity_culture` for locale
  (falling back to the handler's `defaultLocale`) — except rows where `entity_definition` is
  `"DictionaryEntry"`, which map to `sc:dict:<site>:<locale>` for the site resolved from the
  identifier via the configured **`sites`** option (skipped, with a debug log, when no configured
  site matches). Only updates that are actually Dictionary changes revalidate dictionary tags — a
  webhook for an unrelated item never touches them.

Auth (optional): when `SITECORE_REVALIDATE_SECRET` (or the `secret` option) is non-empty, callers must
send the same value in the **`x-revalidate-secret`** header. When unset or blank, no header is required.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`SitecoreRevalidateRouteHandlerOptions`](../type-aliases/SitecoreRevalidateRouteHandlerOptions.md) | Optional inline `secret`, `cacheProfile`, locale, and sites options. |

## Returns

`object`

### POST

> **POST**: (`req`) => `Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<\{ `continues`: `boolean`; `invocation_id`: `string` \| `null`; `revalidated`: `boolean`; `tagsCount`: `number`; \}\>\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<\{ `continues`: `boolean`; `invocation_id`: `string` \| `null`; `revalidated`: `boolean`; `tagsCount`: `number`; \}\>\>
