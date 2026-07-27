[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / analyticsProxyAdapter

# Function: analyticsProxyAdapter()

> **analyticsProxyAdapter**(`request`, `response`): [`AnalyticsProxyAdapter`](../interfaces/AnalyticsProxyAdapter.md)

Defined in: [nextjs/src/initialization/proxy/analytics-adapter.ts:32](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/nextjs/src/initialization/proxy/analytics-adapter.ts#L32)

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
