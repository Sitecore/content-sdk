[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / DefaultRetryStrategy

# Class: DefaultRetryStrategy

Defined in: [packages/core/src/retries.ts:9](https://github.com/Sitecore/content-sdk/blob/3b25a6307ef74f6ab7da606ec8b04e5fcb108ad3/packages/core/src/retries.ts#L9)

Represents a default retry strategy for handling retry attempts in case of specific HTTP status codes.
This class implements the RetryStrategy interface and provides methods to determine whether a request
should be retried and calculates the delay before the next retry attempt.

## Implements

- [`RetryStrategy`](../interfaces/RetryStrategy.md)

## Constructors

### Constructor

> **new DefaultRetryStrategy**(`options`): `DefaultRetryStrategy`

Defined in: [packages/core/src/retries.ts:20](https://github.com/Sitecore/content-sdk/blob/3b25a6307ef74f6ab7da606ec8b04e5fcb108ad3/packages/core/src/retries.ts#L20)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `errorCodes?`: `string`[]; `factor?`: `number`; `statusCodes?`: `number`[]; \} | Configurable options for retry mechanism. |
| `options.errorCodes?` | `string`[] | Node error codes to trigger retries. Default is ['ECONNRESET', 'ETIMEDOUT', 'EPROTO']. |
| `options.factor?` | `number` | Factor by which the delay increases with each retry attempt. Default is 2. |
| `options.statusCodes?` | `number`[] | HTTP status codes to trigger retries on. Default is [429]. |

#### Returns

`DefaultRetryStrategy`

## Methods

### getDelay()

> **getDelay**(`error`, `attempt`): `number`

Defined in: [packages/core/src/retries.ts:33](https://github.com/Sitecore/content-sdk/blob/3b25a6307ef74f6ab7da606ec8b04e5fcb108ad3/packages/core/src/retries.ts#L33)

Calculates the delay (in milliseconds) before the next retry based on the given error and attempt count.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | [`GenericGraphQLClientError`](../type-aliases/GenericGraphQLClientError.md) | The error received from the GraphQL request. |
| `attempt` | `number` | The current attempt number. |

#### Returns

`number`

The delay in milliseconds before the next retry.

#### Implementation of

[`RetryStrategy`](../interfaces/RetryStrategy.md).[`getDelay`](../interfaces/RetryStrategy.md#getdelay)

***

### shouldRetry()

> **shouldRetry**(`error`, `attempt`, `retries`): `boolean`

Defined in: [packages/core/src/retries.ts:26](https://github.com/Sitecore/content-sdk/blob/3b25a6307ef74f6ab7da606ec8b04e5fcb108ad3/packages/core/src/retries.ts#L26)

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

#### Implementation of

[`RetryStrategy`](../interfaces/RetryStrategy.md).[`shouldRetry`](../interfaces/RetryStrategy.md#shouldretry)
