[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / TenantInfo

# Interface: TenantInfo

Defined in: [packages/core/src/tools/auth/models.ts:71](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/models.ts#L71)

Public metadata for a known tenant.

## Properties

### audience

> **audience**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:91](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/models.ts#L91)

OAuth2 audience (e.g., API base URL the token is intended for)

***

### authority

> **authority**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:95](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/models.ts#L95)

Auth authority/issuer URL (e.g., Sitecore identity endpoint)

***

### baseUrl

> **baseUrl**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:99](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/models.ts#L99)

Base URL for the target Sitecore Content Management API

***

### clientId

> **clientId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:87](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/models.ts#L87)

Client ID associated with this tenant's authentication

***

### organizationId

> **organizationId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:83](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/models.ts#L83)

Organization ID the tenant belongs to

***

### tenantId

> **tenantId**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:75](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/models.ts#L75)

Unique ID of the tenant

***

### tenantName

> **tenantName**: `string`

Defined in: [packages/core/src/tools/auth/models.ts:79](https://github.com/Sitecore/content-sdk/blob/50867e76509dd936f2c5285752e0596a542ffb61/packages/core/src/tools/auth/models.ts#L79)

Human-readable name of the tenant
