[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / ExpressRequest

# Interface: ExpressRequest

Defined in: [packages/angular/src/config/http-types.ts:5](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L5)

Minimal Express Request interface for type safety without requiring Express as a dependency

## Extended by

- [`ExpressEditingRequest`](ExpressEditingRequest.md)

## Properties

### body

> **body**: `unknown`

Defined in: [packages/angular/src/config/http-types.ts:9](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L9)

***

### cookies?

> `optional` **cookies?**: `Record`\<`string`, `string`\>

Defined in: [packages/angular/src/config/http-types.ts:15](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L15)

Cookies from the request (requires cookie-parser middleware)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/config/http-types.ts:19](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L19)

Headers from the request

***

### method

> **method**: `string`

Defined in: [packages/angular/src/config/http-types.ts:6](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L6)

***

### path

> **path**: `string`

Defined in: [packages/angular/src/config/http-types.ts:7](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L7)

***

### query

> **query**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/config/http-types.ts:11](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L11)

***

### referrer?

> `optional` **referrer?**: `string`

Defined in: [packages/angular/src/config/http-types.ts:10](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L10)

***

### setHeader?

> `optional` **setHeader?**: (`name`, `value`) => `void`

Defined in: [packages/angular/src/config/http-types.ts:20](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L20)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `string` \| `string`[] \| `undefined` |

#### Returns

`void`

***

### url

> **url**: `string`

Defined in: [packages/angular/src/config/http-types.ts:8](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L8)
