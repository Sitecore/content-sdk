[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / isNextJsMiddlewareResponse

# Function: isNextJsMiddlewareResponse()

> **isNextJsMiddlewareResponse**(`response`): `response is MiddlewareNextResponse`

Defined in: [typeguards/is-next-js-middleware-response.ts:8](https://github.com/Sitecore/content-sdk/blob/4ac6c0b08031d0f8d3e3046612ef022854196c98/packages/utils/src/typeguards/is-next-js-middleware-response.ts#L8)

Determines whether the given response is a Next.js middleware response.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `response` | [`HttpResponse`](../interfaces/HttpResponse.md) \| [`MiddlewareNextResponse`](../interfaces/MiddlewareNextResponse.md) | The response candidate to validate. |

## Returns

`response is MiddlewareNextResponse`

True when the response exposes middleware cookie helpers.
