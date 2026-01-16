[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / auth

# Variable: auth

> `const` **auth**: `object`

Defined in: [packages/core/src/tools/index.ts:26](https://github.com/Sitecore/content-sdk/blob/5a2b53f287cd025776a323be304373d0219e574a/packages/core/src/tools/index.ts#L26)

Preserve "live binding" semantics similar to ES module imports: production
code always sees the current implementation; tests can swap it safely and
restore via `sandbox.restore()` with no hidden global state.

Public surface consumed by the rest of the codebase.

## Type Declaration

### clientCredentialsFlow

> `readonly` **clientCredentialsFlow**: *typeof* `authModule.clientCredentialsFlow`
