# Sitecore Content SDK Search

This module is provided as a part of Sitecore Content SDK. It contains the Search Sitecore Content SDK APIs and utilities.

[Documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/index.html)

[API reference documentation](/ref-docs/search/)

## More Like This (MLT)

Use `seedItemId` or `seedItemUrl` instead of `keyphrase` to request items similar to a seed document. These query fields are mutually exclusive: provide at most one of `keyphrase`, `seedItemId`, or `seedItemUrl`. Seed fields are sent only to `/v1/search`; `/v1/search/suggest` accepts `keyphrase` only. MLT responses use the same mapped shape as keyword search (`results`, `total`, and optional `facets`).

```ts
import { SearchService } from '@sitecore-content-sdk/search';

const searchService = new SearchService({
  contextId: 'SITECORE_EDGE_CONTEXT_ID',
});

// Related items by document ID
const byId = await searchService.search({
  searchIndexId: '1234567890',
  seedItemId: 'item-123',
  limit: 5,
});

byId.results.forEach((item) => {
  console.log(item);
});

// Related items by document URL
const byUrl = await searchService.search({
  searchIndexId: '1234567890',
  seedItemUrl: 'https://example.com/articles/cloud',
});
```

Passing both a keyphrase and a seed field throws a `TypeError`:

```ts
try {
  await searchService.search({
    searchIndexId: '1234567890',
    keyphrase: 'running shoes',
    seedItemId: 'item-123',
  });
} catch (error) {
  // TypeError: Query fields are mutually exclusive. Provide only one of: keyphrase, seedItemId, seedItemUrl. Received: keyphrase, seedItemId
  console.error(error.message);
}
```
