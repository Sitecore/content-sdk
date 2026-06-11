[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/express](../README.md) / ExpressRequest

# Interface: ExpressRequest

Defined in: [packages/angular/src/server/models.ts:18](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L18)

Minimal Express Request interface for type safety without requiring Express as a dependency

## Extended by

- [`ExpressEditingRequest`](../../middleware/interfaces/ExpressEditingRequest.md)

## Properties

### body

> **body**: `unknown`

Defined in: [packages/angular/src/server/models.ts:22](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L22)

***

### cookies?

> `optional` **cookies?**: `Record`\<`string`, `string`\>

Defined in: [packages/angular/src/server/models.ts:27](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L27)

Cookies from the request (requires cookie-parser middleware)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/server/models.ts:31](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L31)

Headers from the request

***

### method

> **method**: `string`

Defined in: [packages/angular/src/server/models.ts:19](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L19)

***

### path

> **path**: `string`

Defined in: [packages/angular/src/server/models.ts:20](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L20)

***

### query

> **query**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/server/models.ts:23](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L23)

***

### url

> **url**: `string`

Defined in: [packages/angular/src/server/models.ts:21](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L21)
