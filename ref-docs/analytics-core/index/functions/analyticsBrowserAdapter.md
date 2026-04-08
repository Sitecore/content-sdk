[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [index](../README.md) / analyticsBrowserAdapter

# Function: analyticsBrowserAdapter()

> **analyticsBrowserAdapter**(): [`AnalyticsBrowserAdapter`](../interfaces/AnalyticsBrowserAdapter.md)

Defined in: [analytics-core/src/initialization/browser-adapter.ts:30](https://github.com/Sitecore/content-sdk/blob/b92d240245a7da53f462f7bcffe6086a3971978d/packages/analytics-core/src/initialization/browser-adapter.ts#L30)

Creates a browser-based analytics adapter that reads and writes the visitor ID
using cookies and can resolve a new client ID from the Edge proxy when needed.
The adapter also provides access to the current URL search parameters.

## Returns

[`AnalyticsBrowserAdapter`](../interfaces/AnalyticsBrowserAdapter.md)

The analytics browser adapter.
