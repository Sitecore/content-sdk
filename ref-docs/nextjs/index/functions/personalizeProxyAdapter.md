[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / personalizeProxyAdapter

# Function: personalizeProxyAdapter()

> **personalizeProxyAdapter**(`request`, `response`): [`PersonalizeProxyAdapter`](../interfaces/PersonalizeProxyAdapter.md)

Defined in: [nextjs/src/initialization/proxy/personalize-adapter.ts:35](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/nextjs/src/initialization/proxy/personalize-adapter.ts#L35)

Creates a proxy-based personalize adapter that reads and writes the profile ID
using cookies and can resolve a new profile ID from the Edge proxy when needed.
The adapter also provides access user agent from the request headers.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `NextRequest` | The HTTP request object. |
| `response` | `NextResponse` | The HTTP response object. |

## Returns

[`PersonalizeProxyAdapter`](../interfaces/PersonalizeProxyAdapter.md)

The personalize proxy adapter.
