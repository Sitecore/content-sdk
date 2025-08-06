[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / RetryStrategy

# Interface: RetryStrategy

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:27](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L27)
=======
Defined in: [packages/core/src/models.ts:27](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L27)
>>>>>>> dd686bb50 (Update API docs)

Defines the strategy for retrying GraphQL requests based on errors and attempts.

## Methods

### getDelay()

> **getDelay**(`error`, `attempt`): `number`

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:42](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L42)
=======
Defined in: [packages/core/src/models.ts:42](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L42)
>>>>>>> dd686bb50 (Update API docs)

Calculates the delay (in milliseconds) before the next retry based on the given error and attempt count.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | [`GenericGraphQLClientError`](../type-aliases/GenericGraphQLClientError.md) | The error received from the GraphQL request. |
| `attempt` | `number` | The current attempt number. |

#### Returns

`number`

The delay in milliseconds before the next retry.

***

### shouldRetry()

> **shouldRetry**(`error`, `attempt`, `retries`): `boolean`

<<<<<<< HEAD
Defined in: [packages/core/src/models.ts:35](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/models.ts#L35)
=======
Defined in: [packages/core/src/models.ts:35](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/models.ts#L35)
>>>>>>> dd686bb50 (Update API docs)

Determines whether a request should be retried based on the given error and attempt count.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | [`GenericGraphQLClientError`](../type-aliases/GenericGraphQLClientError.md) | The error received from the GraphQL request. |
| `attempt` | `number` | The current attempt number. |
| `retries` | `number` | The number of retries configured. |

#### Returns

`boolean`

A boolean indicating whether to retry the request.
