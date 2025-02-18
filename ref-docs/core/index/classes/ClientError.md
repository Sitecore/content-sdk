[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / ClientError

# Class: ClientError

Defined in: packages/core/node\_modules/graphql-request/build/esm/types.d.ts:42

## Extends

- `Error`

## Constructors

### new ClientError()

> **new ClientError**(`response`, `request`): [`ClientError`](ClientError.md)

Defined in: packages/core/node\_modules/graphql-request/build/esm/types.d.ts:45

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | `GraphQLResponse` |
| `request` | `GraphQLRequestContext` |

#### Returns

[`ClientError`](ClientError.md)

#### Overrides

`Error.constructor`

## Properties

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### request

> **request**: `GraphQLRequestContext`

Defined in: packages/core/node\_modules/graphql-request/build/esm/types.d.ts:44

***

### response

> **response**: `GraphQLResponse`

Defined in: packages/core/node\_modules/graphql-request/build/esm/types.d.ts:43

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: packages/core/node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: packages/core/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: packages/core/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
