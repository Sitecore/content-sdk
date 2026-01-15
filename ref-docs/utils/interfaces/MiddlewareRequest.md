[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / MiddlewareRequest

# Interface: MiddlewareRequest

Defined in: [interfaces.ts:39](https://github.com/Sitecore/content-sdk/blob/c71aa78ec59bb08efdf821d01673c8efe517b118/packages/utils/src/interfaces.ts#L39)

Interface for supporting request from Edge Next.js
includes types compatible with both NextJS versions 12 & 13

## Properties

### cookies

> **cookies**: `object`

Defined in: [interfaces.ts:40](https://github.com/Sitecore/content-sdk/blob/c71aa78ec59bb08efdf821d01673c8efe517b118/packages/utils/src/interfaces.ts#L40)

#### get()

> **get**: (`key`) => `string` \| [`Cookie`](Cookie.md) \| `undefined`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

##### Returns

`string` \| [`Cookie`](Cookie.md) \| `undefined`

#### set

> **set**: (`key`, `value`, `options`) => `any` \| (...`args`) => `any`

***

### geo?

> `optional` **geo**: `object`

Defined in: [interfaces.ts:52](https://github.com/Sitecore/content-sdk/blob/c71aa78ec59bb08efdf821d01673c8efe517b118/packages/utils/src/interfaces.ts#L52)

#### city?

> `optional` **city**: `string`

#### country?

> `optional` **country**: `string`

#### region?

> `optional` **region**: `string`

***

### headers

> **headers**: `object`

Defined in: [interfaces.ts:48](https://github.com/Sitecore/content-sdk/blob/c71aa78ec59bb08efdf821d01673c8efe517b118/packages/utils/src/interfaces.ts#L48)

#### get()

> **get**: (`name`) => `string` \| `null`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

##### Returns

`string` \| `null`

***

### url?

> `optional` **url**: `string`

Defined in: [interfaces.ts:51](https://github.com/Sitecore/content-sdk/blob/c71aa78ec59bb08efdf821d01673c8efe517b118/packages/utils/src/interfaces.ts#L51)
