[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / TenantArgs

# Interface: TenantArgs

Defined in: [packages/core/src/tools/auth/models.ts:4](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/core/src/tools/auth/models.ts#L4)

CLI arguments used for authentication and tenant identification.

## Properties

### audience?

> `optional` **audience**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:24](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/core/src/tools/auth/models.ts#L24)

OAuth2 audience (e.g., API base URL the token is intended for)

***

### authority?

> `optional` **authority**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:28](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/core/src/tools/auth/models.ts#L28)

Auth authority/issuer URL (e.g., Sitecore identity endpoint)

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:32](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/core/src/tools/auth/models.ts#L32)

Base URL for the target Sitecore Content Management API

***

### clientId

> **clientId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:8](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/core/src/tools/auth/models.ts#L8)

OAuth2 client ID used to identify the application

***

### clientSecret?

> `optional` **clientSecret**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:12](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/core/src/tools/auth/models.ts#L12)

Client secret used for client credentials flow

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:16](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/core/src/tools/auth/models.ts#L16)

Organization ID associated with the tenant

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:20](https://github.com/Sitecore/content-sdk/blob/8e9b3f20fed3f70d55b7aa539bb1178ec431de85/packages/core/src/tools/auth/models.ts#L20)

Tenant ID used for scoping the login
