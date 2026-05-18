[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [index](../README.md) / personalizeServerAdapter

# Function: personalizeServerAdapter()

> **personalizeServerAdapter**\<`Request`, `Response`\>(`request`, `response`): [`PersonalizeServerAdapter`](../interfaces/PersonalizeServerAdapter.md)

Defined in: [personalize/src/initialization/server-adapter.ts:42](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/personalize/src/initialization/server-adapter.ts#L42)

Creates a server-based personalize adapter that reads and writes the profile ID
using cookies and can resolve a new profile ID from the Edge proxy when needed.
The adapter also provides access user agent from the request headers.

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

[`PersonalizeServerAdapter`](../interfaces/PersonalizeServerAdapter.md)

An PersonalizeServerAdapter instance.
