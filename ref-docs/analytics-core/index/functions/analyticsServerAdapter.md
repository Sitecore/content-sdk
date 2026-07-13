[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [index](../README.md) / analyticsServerAdapter

# Function: analyticsServerAdapter()

> **analyticsServerAdapter**\<`Request`, `Response`\>(`request`, `response`): [`AnalyticsServerAdapter`](../interfaces/AnalyticsServerAdapter.md)

Defined in: [analytics-core/src/initialization/server-adapter.ts:35](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/analytics-core/src/initialization/server-adapter.ts#L35)

Creates a server-based analytics adapter that reads and writes the visitor ID
using cookies and can resolve a new client ID from the Edge proxy when needed.
The adapter also provides access to the current URL search parameters.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `Request` *extends* `IncomingMessage` | The HTTP request type extending `IncomingMessage`. |
| `Response` *extends* `OutgoingMessage`\<`IncomingMessage`\> | The HTTP response type extending `OutgoingMessage`. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `Request` | The HTTP request object. |
| `response` | `Response` | The HTTP response object. |

## Returns

[`AnalyticsServerAdapter`](../interfaces/AnalyticsServerAdapter.md)

The analytics server adapter.
