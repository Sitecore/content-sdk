[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [content/src/config/models.ts:250](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/config/models.ts#L250)

Type used as CLI config input in sitecore.cli.config

## Properties

### atoms?

> `optional` **atoms?**: `object`

Defined in: [content/src/config/models.ts:285](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/config/models.ts#L285)

Configuration for the `sitecore-tools project atoms` CLI commands.

#### validation?

> `optional` **validation?**: `object`

Validation configuration for atoms.

##### validation.breakOnError?

> `optional` **breakOnError?**: `boolean`

When true, the CLI will exit with a non-zero code on validation errors.
Useful for CI pipelines that should fail on broken atom contracts.

###### Default

```ts
false
```

***

### build?

> `optional` **build?**: `object`

Defined in: [content/src/config/models.ts:258](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/config/models.ts#L258)

Configuration for the `sitecore-tools build` CLI command

#### commands?

> `optional` **commands?**: (`args?`) => `Promise`\<`void`\>[]

Commands to run during the build process

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args?` | \{ `scConfig`: [`SitecoreConfig`](SitecoreConfig.md); \} |
| `args.scConfig?` | [`SitecoreConfig`](SitecoreConfig.md) |

##### Returns

`Promise`\<`void`\>

***

### componentMap?

> `optional` **componentMap?**: [`GenerateMapArgs`](../../tools/type-aliases/GenerateMapArgs.md) & `object`

Defined in: [content/src/config/models.ts:276](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/config/models.ts#L276)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type Declaration

##### generator?

> `optional` **generator?**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### config

> **config**: [`SitecoreConfig`](SitecoreConfig.md)

Defined in: [content/src/config/models.ts:254](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/config/models.ts#L254)

Sitecore configuration (`sitecore.config` file)

***

### scaffold?

> `optional` **scaffold?**: `object`

Defined in: [content/src/config/models.ts:267](https://github.com/Sitecore/content-sdk/blob/d8ef09ee24ff4e01fb1e538a88aebba13f3fe89b/packages/content/src/config/models.ts#L267)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates?**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
