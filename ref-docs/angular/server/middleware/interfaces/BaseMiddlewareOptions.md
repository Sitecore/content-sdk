[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / BaseMiddlewareOptions

# Interface: BaseMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/models.ts:55](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/server/middleware/models.ts#L55)

Base configuration for server middlewares (multisite, personalization, redirects, etc).
Provides common path matching and skip logic.

## Properties

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/angular/src/server/middleware/models.ts:60](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/server/middleware/models.ts#L60)

Enable/disable this middleware. When false, all requests skip it.

#### Default

```ts
true
```

***

### matcher?

> `optional` **matcher?**: [`MiddlewareMatcher`](MiddlewareMatcher.md)

Defined in: [packages/angular/src/server/middleware/models.ts:69](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/server/middleware/models.ts#L69)

Path matching rules (glob patterns) to control which requests this middleware processes.
Integrates with default exclusions (API routes, static files, editing/preview).

***

### skip?

> `optional` **skip?**: (`req`) => `boolean`

Defined in: [packages/angular/src/server/middleware/models.ts:64](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/server/middleware/models.ts#L64)

Custom request predicate to skip middleware execution. Runs after built-in checks.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | [`ExpressRequest`](ExpressRequest.md) |

#### Returns

`boolean`
