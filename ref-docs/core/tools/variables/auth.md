[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / auth

# Variable: auth

> `const` **auth**: `object`

Defined in: [packages/core/src/tools/index.ts:19](https://github.com/Sitecore/content-sdk/blob/f2948d819f7079524f7ecc571981b044a2f89025/packages/core/src/tools/index.ts#L19)

Preserve "live binding" semantics similar to ES module imports: production
code always sees the current implementation; tests can swap it safely and
restore via `sandbox.restore()` with no hidden global state.

Public surface consumed by the rest of the codebase.

## Type declaration

### clientCredentialsFlow

> `readonly` **clientCredentialsFlow**: *typeof* `authModule.clientCredentialsFlow`
