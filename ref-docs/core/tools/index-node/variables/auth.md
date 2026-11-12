[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / auth

# Variable: auth

> `const` **auth**: `object`

Defined in: [packages/core/src/tools/index-node.ts:17](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/index-node.ts#L17)

Preserve "live binding" semantics similar to ES module imports: production
code always sees the current implementation; tests can swap it safely and
restore via `sandbox.restore()` with no hidden global state.

## Type Declaration

### clientCredentialsFlow

> `readonly` **clientCredentialsFlow**: *typeof* `authModule.clientCredentialsFlow`
