[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderContext

# Type Alias: LoaderContext

> **LoaderContext** = `object`

Defined in: [packages/angular/src/loaders/models.ts:34](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L34)

Context provided to loader functions.
Contains information about the current request including URL, params, query, and request context.

## Properties

### params

> **params**: `Params`

Defined in: [packages/angular/src/loaders/models.ts:47](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L47)

Route parameters from all matched segments.

When locales are configured and the route tree uses `scLocaleMatcher`, the matched
locale is exposed as `params.locale`. The resolver also defaults `params.locale` to
`defaultLanguage` from `sitecore.config` when no locale segment was matched — loaders
can rely on a concrete `params.locale` regardless of URL shape.

***

### query

> **query**: `Record`\<`string`, `string` \| `string`[]\>

Defined in: [packages/angular/src/loaders/models.ts:51](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L51)

Query string parameters

***

### req?

> `optional` **req?**: `Request`

Defined in: [packages/angular/src/loaders/models.ts:55](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L55)

Server-only: the incoming request

***

### requestContext?

> `optional` **requestContext?**: [`RequestContext`](../interfaces/RequestContext.md)

Defined in: [packages/angular/src/loaders/models.ts:77](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L77)

Server-only: context from the incoming HTTP request.
Contains hostname, cookies, query params, and headers.
Use with createSiteResolver() to determine the current site.

#### Example

```typescript
const resolveSite = createSiteResolver({ sites, defaultSite: config.defaultSite });

export const pageLoader: LoaderFn = async (ctx) => {
  if (ctx.requestContext) {
    const { site } = resolveSite(ctx.requestContext);
    return client.getPage(ctx.url, { site: site.name });
  }
  return client.getPage(ctx.url);
};
```

***

### res?

> `optional` **res?**: `Response`

Defined in: [packages/angular/src/loaders/models.ts:59](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L59)

Server-only: the response object

***

### url

> **url**: `string`

Defined in: [packages/angular/src/loaders/models.ts:38](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/loaders/models.ts#L38)

The current URL path
