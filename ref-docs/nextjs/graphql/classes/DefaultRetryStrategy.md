[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [graphql](../README.md) / DefaultRetryStrategy

# Class: DefaultRetryStrategy

Defined in: core/types/retries.d.ts:7

Represents a default retry strategy for handling retry attempts in case of specific HTTP status codes.
This class implements the RetryStrategy interface and provides methods to determine whether a request
should be retried and calculates the delay before the next retry attempt.

## Implements

- [`RetryStrategy`](../interfaces/RetryStrategy.md)

## Constructors

### new DefaultRetryStrategy()

> **new DefaultRetryStrategy**(`options`?): [`DefaultRetryStrategy`](DefaultRetryStrategy.md)

Defined in: core/types/retries.d.ts:17

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options`? | \{ `errorCodes`: `string`[]; `factor`: `number`; `statusCodes`: `number`[]; \} | Configurable options for retry mechanism. |
| `options.errorCodes`? | `string`[] | Node error codes to trigger retries. Default is ['ECONNRESET', 'ETIMEDOUT', 'EPROTO']. |
| `options.factor`? | `number` | Factor by which the delay increases with each retry attempt. Default is 2. |
| `options.statusCodes`? | `number`[] | HTTP status codes to trigger retries on. Default is [429]. |

#### Returns

[`DefaultRetryStrategy`](DefaultRetryStrategy.md)

## Methods

### getDelay()

> **getDelay**(`error`, `attempt`): `number`

Defined in: core/types/retries.d.ts:23

Calculates the delay (in milliseconds) before the next retry based on the given error and attempt count.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | `GenericGraphQLClientError` | The error received from the GraphQL request. |
| `attempt` | `number` | The current attempt number. |

#### Returns

`number`

The delay in milliseconds before the next retry.

#### Implementation of

[`RetryStrategy`](../interfaces/RetryStrategy.md).[`getDelay`](../interfaces/RetryStrategy.md#getdelay)

***

### shouldRetry()

> **shouldRetry**(`error`, `attempt`, `retries`): `boolean`

Defined in: core/types/retries.d.ts:22

Determines whether a request should be retried based on the given error and attempt count.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | `GenericGraphQLClientError` | The error received from the GraphQL request. |
| `attempt` | `number` | The current attempt number. |
| `retries` | `number` | The number of retries configured. |

#### Returns

`boolean`

A boolean indicating whether to retry the request.

#### Implementation of

[`RetryStrategy`](../interfaces/RetryStrategy.md).[`shouldRetry`](../interfaces/RetryStrategy.md#shouldretry)
