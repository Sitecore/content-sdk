[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / auth

# Variable: auth

> `const` **auth**: `object`

Defined in: [packages/core/src/tools/index.ts:31](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/core/src/tools/index.ts#L31)

Preserve "live binding" semantics similar to ES module imports: production
code always sees the current implementation; tests can swap it safely and
restore via `sandbox.restore()` with no hidden global state.

Public surface consumed by the rest of the codebase.

## Type Declaration

### clientCredentialsFlow

> `readonly` **clientCredentialsFlow**: *typeof* `authModule.clientCredentialsFlow`
