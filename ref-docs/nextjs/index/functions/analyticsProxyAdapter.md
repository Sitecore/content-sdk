[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / analyticsProxyAdapter

# Function: analyticsProxyAdapter()

> **analyticsProxyAdapter**(`request`, `response`): [`AnalyticsProxyAdapter`](../interfaces/AnalyticsProxyAdapter.md)

Defined in: [nextjs/src/initialization/proxy/analytics-adapter.ts:33](https://github.com/Sitecore/content-sdk/blob/1f49f65949106a1df6f81df5c5e41772e45f913a/packages/nextjs/src/initialization/proxy/analytics-adapter.ts#L33)

Creates a proxy-based analytics adapter that reads and writes the visitor ID
using cookies and can resolve a new client ID from the Edge proxy when needed.
The adapter also provides access to the current URL search parameters.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `NextRequest` | The Next.js request object. |
| `response` | `NextResponse` | The Next.js response object. |

## Returns

[`AnalyticsProxyAdapter`](../interfaces/AnalyticsProxyAdapter.md)

The analytics proxy adapter.
