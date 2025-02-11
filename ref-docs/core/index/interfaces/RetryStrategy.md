[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / RetryStrategy

# Interface: RetryStrategy

Defined in: [packages/core/src/graphql-request-client.ts:43](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/graphql-request-client.ts#L43)

Defines the strategy for retrying GraphQL requests based on errors and attempts.

## Methods

### getDelay()

> **getDelay**(`error`, `attempt`): `number`

Defined in: [packages/core/src/graphql-request-client.ts:58](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/graphql-request-client.ts#L58)

Calculates the delay (in milliseconds) before the next retry based on the given error and attempt count.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | [`GraphQLClientError`](../../graphql/type-aliases/GraphQLClientError.md) | The error received from the GraphQL request. |
| `attempt` | `number` | The current attempt number. |

#### Returns

`number`

The delay in milliseconds before the next retry.

***

### shouldRetry()

> **shouldRetry**(`error`, `attempt`, `retries`): `boolean`

Defined in: [packages/core/src/graphql-request-client.ts:51](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/graphql-request-client.ts#L51)

Determines whether a request should be retried based on the given error and attempt count.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `error` | [`GraphQLClientError`](../../graphql/type-aliases/GraphQLClientError.md) | The error received from the GraphQL request. |
| `attempt` | `number` | The current attempt number. |
| `retries` | `number` | The number of retries configured. |

#### Returns

`boolean`

A boolean indicating whether to retry the request.
