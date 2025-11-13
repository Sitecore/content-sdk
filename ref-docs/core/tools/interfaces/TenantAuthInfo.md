[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / TenantAuthInfo

# Interface: TenantAuthInfo

Defined in: [packages/core/src/tools/auth/models.ts:45](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L45)

Auth configuration stored per tenant for accessing Sitecore APIs.

## Properties

### access\_token

> **access\_token**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:49](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L49)

Access token issued by the identity provider

***

### clientSecret?

> `optional` **clientSecret**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:61](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L61)

Secret used for client credentials flow and re-authenticate

***

### expires\_at

> **expires\_at**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:57](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L57)

Exact ISO timestamp when the token expires

***

### expires\_in

> **expires\_in**: `number`

Defined in: [packages/core/src/tools/auth/models.ts:53](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L53)

Token expiration duration in seconds

***

### refresh\_token?

> `optional` **refresh\_token**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:65](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/auth/models.ts#L65)
