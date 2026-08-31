[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / auth

# Variable: auth

> `const` **auth**: `object`

Defined in: [packages/core/src/tools/index-node.ts:15](https://github.com/Sitecore/content-sdk/blob/8f962400f3b79f00425a8cd76a6d2082b5b47c47/packages/core/src/tools/index-node.ts#L15)

Preserve "live binding" semantics similar to ES module imports: production
code always sees the current implementation; tests can swap it safely and
restore via `sandbox.restore()` with no hidden global state.

## Type Declaration

### clientCredentialsFlow

> `readonly` **clientCredentialsFlow**: *typeof* `authModule.clientCredentialsFlow`
