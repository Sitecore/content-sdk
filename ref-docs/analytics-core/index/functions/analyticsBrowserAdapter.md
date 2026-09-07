[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [index](../README.md) / analyticsBrowserAdapter

# Function: analyticsBrowserAdapter()

> **analyticsBrowserAdapter**(): [`AnalyticsBrowserAdapter`](../interfaces/AnalyticsBrowserAdapter.md)

Defined in: [analytics-core/src/initialization/browser-adapter.ts:31](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/analytics-core/src/initialization/browser-adapter.ts#L31)

Creates a browser-based analytics adapter that reads and writes the visitor ID
using cookies and can resolve a new client ID from the Edge proxy when needed.
The adapter also provides access to the current URL search parameters.

## Returns

[`AnalyticsBrowserAdapter`](../interfaces/AnalyticsBrowserAdapter.md)

The analytics browser adapter.
