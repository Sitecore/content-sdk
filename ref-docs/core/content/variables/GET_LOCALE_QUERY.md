[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET\_LOCALE\_QUERY

# Variable: GET\_LOCALE\_QUERY

> `const` **GET\_LOCALE\_QUERY**: "\n  query GetLocaleById ($id: ID!) \{\n    locale(id: $id) \{\n      id\n      label\n    \}\n  \}\n"

Defined in: [packages/core/src/content/locales.ts:32](https://github.com/Sitecore/content-sdk/blob/470c7bb404154f6c8bab7ab8dcba5e4e665da1cc/packages/core/src/content/locales.ts#L32)

GraphQL query to retrieve a specific locale by its ID.

## Param

The unique identifier for the locale.

## Returns

The GraphQL query string.
