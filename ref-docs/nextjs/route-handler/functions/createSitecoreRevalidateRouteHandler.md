[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createSitecoreRevalidateRouteHandler

# Function: createSitecoreRevalidateRouteHandler()

> **createSitecoreRevalidateRouteHandler**(`options?`): `object`

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:84](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L84)

Creates a single `POST` handler for `/api/revalidate` that consumes Sitecore Experience Edge / Content
Operations webhook bodies (and equivalent ad-hoc calls that reuse the same body shape).

The body is expected to be a JSON object that resolves to at least one Sitecore cache tag:

- **`updates[]`** — Sitecore publish-event rows. Each row's `identifier` (with `-media` / `-layout`
  suffix stripped) maps to an `sc:item:<id>:<locale>:latest` tag, using `entity_culture` for locale
  (falling back to the handler's `defaultLocale`).
- **`tags[]`** — pass-through and convenience array:
  - Strings already starting with `sc:` are used verbatim (e.g. `sc:route:...`, `sc:item:...`, `sc:dict:...`).
  - Bare values are treated as Sitecore item ids and mapped to `sc:item:<id>:<defaultLocale>:latest`.

When **`sites`** is configured, the handler also appends one `sc:dict:<site>:<locale>` tag per
site so dictionary updates flow through the same call.

Auth (optional): when `SITECORE_REVALIDATE_SECRET` (or the `secret` option) is non-empty, callers must
send the same value in the **`x-revalidate-secret`** header. When unset or blank, no header is required.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`SitecoreRevalidateRouteHandlerOptions`](../type-aliases/SitecoreRevalidateRouteHandlerOptions.md) | Optional inline `secret`, `cacheProfile`, locale, sites, and dictionary options. |

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
