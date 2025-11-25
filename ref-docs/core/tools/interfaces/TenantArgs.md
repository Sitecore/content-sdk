[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / TenantArgs

# Interface: TenantArgs

Defined in: [packages/core/src/tools/auth/models.ts:5](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/core/src/tools/auth/models.ts#L5)

CLI arguments used for authentication and tenant identification.

## Properties

### audience?

> `optional` **audience**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:25](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/core/src/tools/auth/models.ts#L25)

OAuth2 audience (e.g., API base URL the token is intended for)

***

### authority?

> `optional` **authority**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:29](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/core/src/tools/auth/models.ts#L29)

Auth authority/issuer URL (e.g., Sitecore identity endpoint)

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:33](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/core/src/tools/auth/models.ts#L33)

Base URL for the target Sitecore Content Management API

***

### clientId

> **clientId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:9](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/core/src/tools/auth/models.ts#L9)

OAuth2 client ID used to identify the application

***

### clientSecret?

> `optional` **clientSecret**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:13](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/core/src/tools/auth/models.ts#L13)

Client secret used for client credentials flow

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:17](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/core/src/tools/auth/models.ts#L17)

Organization ID associated with the tenant

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:21](https://github.com/Sitecore/content-sdk/blob/f86a113eddbeb48a7786fff2ebd64724e9f61199/packages/core/src/tools/auth/models.ts#L21)

Tenant ID used for scoping the login
