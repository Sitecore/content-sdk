[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / isNextJsMiddlewareRequest

# Function: isNextJsMiddlewareRequest()

> **isNextJsMiddlewareRequest**(`request`): `request is MiddlewareRequest`

Defined in: [typeguards/is-next-js-middleware-request.ts:8](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/utils/src/typeguards/is-next-js-middleware-request.ts#L8)

Determines whether the given request is a Next.js middleware request.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | [`Request`](../type-aliases/Request.md) | The request candidate to validate. |

## Returns

`request is MiddlewareRequest`

True when the request exposes middleware cookie helpers.
