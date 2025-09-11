# @sitecore-content-sdk/core/content

This package is part of the [Sitecore Content SDK](https://github.com/Sitecore/content-sdk) and provides the core API for working with XM Cloud Content.

It enables developers to query and fetch structured content from XM Cloud Content, serving as the foundation for building content‑driven applications.

## Table of contents

- [What’s included](#whats-included)
- [Installation](#installation)
- [Getting started](#getting-started)
  - [Option A: Use environment variables via factory](#option-a-use-environment-variables-via-factory)
  - [Option B: Construct with explicit options](#option-b-construct-with-explicit-options)
- [Quick examples](#quick-examples)
  - [Execute an arbitrary GraphQL query](#execute-an-arbitrary-graphql-query)
  - [Locales](#locales)
  - [Taxonomies](#taxonomies)
- [Debugging requests](#debugging-requests)
- [Further reading](#further-reading)

## What’s included

- Content GraphQL Client (`ContentClient`) tailored for XM Cloud Content endpoint
- Built‑in typed queries for common entities:
  - Locales: fetch one locale or list all locales
  - Taxonomies: fetch all taxonomies (with pagination) or a single taxonomy (with paginated terms)
- TypeScript types for all the entities and queries

## Installation

```bash
npm install @sitecore-content-sdk/core
```

## Getting started

You can instantiate a `ContentClient` directly with explicit options, or use the factory `ContentClient.createClient()` which reads from environment variables.

| Parameter    | Required | Source             | Default Value                                                                 | Description                                       |
|--------------|----------|--------------------|--------------------------------------------------------------------------------|---------------------------------------------------|
| tenant       | ✅ Yes    | SITECORE_CS_TENANT | —                                                                              | The name of the Sitecore tenant.                  |
| token        | ✅ Yes    | SITECORE_CS_TOKEN  | —                                                                              | The API access token used for authentication.     |
| environment  | No       | SITECORE_CS_ENVIRONMENT | 'main'                                                                     | The target environment for the content.           |
| preview      | No       | SITECORE_CS_PREVIEW | false                                                                        | Enables preview mode if set to `true`.              |
| url          | No       | SITECORE_CS_URL    | <https://cs-graphqlapi-staging.sitecore-staging.cloud> | The base GraphQL endpoint of the XM Cloud Content API.     |

> **NOTE**: Do not commit the token to the repository. Use environment variables instead.

### Option A: Use environment variables via factory

This is the recommended approach when you want to rely on `.env` configuration.

```ts
import { ContentClient } from '@sitecore-content-sdk/core/content';

const client = ContentClient.createClient();
```

You can also pass parameters directly to `ContentClient.createClient()`, if you want to override specific values. All parameters are optional in this method, since the client falls back to environment variables when values are not explicitly provided.

### Option B: Construct with explicit options

This method gives you explicit control by passing parameters directly.

```ts
import { ContentClient } from '@sitecore-content-sdk/core/content';

const client = new ContentClient({
  url: 'https://cs-graphqlapi-dev.sitecore-dev.cloud',
  tenant: 'my-tenant',
  environment: 'dev',
  preview: false,
  token: process.env.SITECORE_CS_TOKEN as string,
});
```

## Quick examples

### Execute an arbitrary GraphQL query

The `get<T>(query, variables?, options?)` method is a generic method that allows you to perform typed GraphQL queries against the API.

```ts
import { ContentClient } from '@sitecore-content-sdk/core/content';

const client = ContentClient.createClient();

const QUERY = /* GraphQL */ `{
  manyBlog {
    results {
      id
      name
      content
    }
  }
}`;

interface ManyBlogResponse {
  manyBlog: {
    results: {
      id: string;
      name: string;
      content: string;
    }[];
  };
}

client.get<ManyBlogResponse>(QUERY).then((response) => {
  response.manyBlog.results.forEach((blog) => {
    console.log(`ID: ${blog.id}`);
    console.log(`Name: ${blog.name}`);
    console.log(`Content: ${blog.content}`);
    console.log('-------------------');
  });
});
```

### Locales

To retrieve available locale(s) from the Content API, the `ContentClient` provides utility methods:

- `getLocale(id: string)`: Fetches a single locale by its unique ID.

```ts
import { ContentClient } from '@sitecore-content-sdk/core/content';

const client = ContentClient.createClient();

client.getLocale('en')
  .then((locale) => console.log('Locale:', locale));
```

- `getLocales()`: Retrieves a list of all available locales.

```ts
client.getLocales()
  .then((res) => {
    res.forEach((locale) => {
      console.log(`Locale ID: ${locale.id}, Label: ${locale.label}`);
  });
})
```

- Using custom client instance:

```ts
import { GET_LOCALES_QUERY, LocalesQueryResponse } from '@sitecore-content-sdk/core/content';

// Your custom GraphQL client instance
const client = createClient();

client.get<LocalesQueryResponse>(GET_LOCALES_QUERY)
  .then((res) => {
    res.manyLocale.forEach((locale) => {
      console.log(`Locale ID: ${locale.system.id}, Label: ${locale.system.label}`);
    });
});
```

### Taxonomies

To retrieve taxonomy data from the Content API, the `ContentClient` provides utility methods:

- `getTaxonomy({ id, terms? })`: Fetches a single taxonomy by its unique ID, with optional pagination for its terms.
  - `id (string, required)`: The unique taxonomy ID.
  - `terms ({ pageSize?: number; after?: string })`: Pagination for terms (number per page and pagination cursor).

```ts
import { ContentClient } from '@sitecore-content-sdk/core/content';

const client = ContentClient.createClient();

(async () => {
  let taxonomy = await client.getTaxonomy({
    id: 'YOUR_TAXONOMY_ID',
    terms: { pageSize: 5 },
  });

  if (!taxonomy) {
    console.error('Taxonomy not found');
    return;
  }

  console.log('Taxonomy:', taxonomy);

  taxonomy.terms.results.forEach((term) => {
    console.log(`Term ID: ${term.id}, Name: ${term.name}`);
  });

  while (taxonomy.terms.hasMore && taxonomy.terms.cursor) {
    taxonomy = await client.getTaxonomy({
      id: 'YOUR_TAXONOMY_ID',
      terms: { pageSize: 5, after: taxonomy.terms.cursor },
    });

    if (!taxonomy) {
      console.error('Taxonomy not found');
      return;
    }

    console.log('\nNext page of terms:');

    taxonomy.terms.results.forEach((term) => {
      console.log(`Term ID: ${term.id}, Name: ${term.name}`);
    });
  }
})();
```

- `getTaxonomies({ pageSize?, after? })`: Retrieves a paginated list of all available taxonomies.
  - `pageSize (number)`: The number of taxonomies per page.
  - `after (string)`: Pagination cursor (use the cursor value returned from a previous call).

```ts
import { ContentClient } from '@sitecore-content-sdk/core/content';

const client = ContentClient.createClient();

(async () => {
  let taxonomyList = await client.getTaxonomies({ pageSize: 3 });

  taxonomyList.results.forEach((taxonomy, idx) => {
    console.log(`Taxonomy[${idx}] Name: ${taxonomy.system.name}, ID: ${taxonomy.system.id}`);

    taxonomy.terms.forEach((term) => {
      console.log(`Term: ${term.name} (ID: ${term.id})`);
    });
  });

  while (taxonomyList.hasMore && taxonomyList.cursor) {
    taxonomyList = await client.getTaxonomies({
      pageSize: 3,
      after: taxonomyList.cursor,
    });

    console.log('\nNext page of taxonomies:');

    taxonomyList.results.forEach((taxonomy, idx) => {
      console.log(`Taxonomy[${idx}] Name: ${taxonomy.system.name}, ID: ${taxonomy.system.id}`);

      taxonomy.terms.forEach((term) => {
        console.log(`Term: ${term.name} (ID: ${term.id})`);
      });
    });
  }
})();
```

- Using custom client

```ts
import { GET_TAXONOMIES_QUERY, TaxonomiesQueryResponse } from '@sitecore-content-sdk/core/content';

const client = createClient();

(async () => {
  const res: TaxonomiesQueryResponse = await client.get(GET_TAXONOMIES_QUERY, { pageSize: 3 });

  res.manyTaxonomy.results.forEach((taxonomy) => {
    console.log(`Taxonomy ID: ${taxonomy.system.id}, Name: ${taxonomy.system.name}`);
    taxonomy.terms.results.forEach((term) => {
      console.log(`Term ID: ${term.id}, Name: ${term.name}`);
    });
  });

  if (res.manyTaxonomy.hasMore) {
    console.log('More taxonomies available. Use cursor:', res.manyTaxonomy.cursor);
  }
})();
```

## Debugging requests

Enable debug logs programmatically using the `debug` package namespaces. Use `core:content` namespace.
You can also set `DEBUG` environment variable to enable debug logs.

```ts
import { enableDebug } from '@sitecore-content-sdk/core';

enableDebug('core:content');
```

### Further reading

- [API reference (core/content)](../../../../ref-docs/core/content/)
- [Full Core package reference](../../../../ref-docs/core/)
