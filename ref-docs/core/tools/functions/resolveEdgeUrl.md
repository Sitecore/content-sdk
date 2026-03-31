[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / resolveEdgeUrl

# Function: resolveEdgeUrl()

> **resolveEdgeUrl**(`edgeUrl?`): `string`

Defined in: [packages/core/src/tools/resolve-edge-url.ts:43](https://github.com/Sitecore/content-sdk/blob/0ae7ff2b415bcf81d01745bfcd179fc1062f369e/packages/core/src/tools/resolve-edge-url.ts#L43)

Resolves the Sitecore Edge URL based on configuration and environment.

Priority order:
1. Explicit `edgeUrl` parameter (if provided and not empty)
2. `SITECORE_EDGE_PLATFORM_HOSTNAME` environment variable
3. Default Edge Platform URL (`https://edge-platform.sitecorecloud.io`)

The hostname env var can be provided as:
- Full URL: `https://my-custom-edge.example.com`
- Hostname only: `my-custom-edge.example.com` (will be prefixed with `https://`)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `edgeUrl?` | `string` | Optional explicit Edge URL to use (takes precedence if provided) |

## Returns

`string`

The resolved Edge Platform base URL (normalized, no trailing slash)

## Examples

```ts
resolveEdgeUrl() // => 'https://my-tenant.edge.example.com'
```

```ts
resolveEdgeUrl('https://custom.edge.com') // => 'https://custom.edge.com'
```

```ts
resolveEdgeUrl() // => 'https://edge-platform.sitecorecloud.io'
```
