[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / RetryStrategy

# Interface: RetryStrategy

Defined in: [packages/core/src/models.ts:27](https://github.com/Sitecore/xmc-jss-dev/blob/2587fa13814e20ee230863406a92229f2eebdb43/packages/core/src/models.ts#L27)

Defines the strategy for retrying GraphQL requests based on errors and attempts.

## Methods

### getDelay()

> **getDelay**(`error`, `attempt`): `number`

Defined in: [packages/core/src/models.ts:42](https://github.com/Sitecore/xmc-jss-dev/blob/2587fa13814e20ee230863406a92229f2eebdb43/packages/core/src/models.ts#L42)

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

Defined in: [packages/core/src/models.ts:35](https://github.com/Sitecore/xmc-jss-dev/blob/2587fa13814e20ee230863406a92229f2eebdb43/packages/core/src/models.ts#L35)

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
