[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / RetryStrategy

# Interface: RetryStrategy

Defined in: [packages/core/src/models.ts:22](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/core/src/models.ts#L22)

Defines the strategy for retrying GraphQL requests based on errors and attempts.

## Methods

### getDelay()

> **getDelay**(`error`, `attempt`): `number`

Defined in: [packages/core/src/models.ts:37](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/core/src/models.ts#L37)

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

Defined in: [packages/core/src/models.ts:30](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/core/src/models.ts#L30)

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
