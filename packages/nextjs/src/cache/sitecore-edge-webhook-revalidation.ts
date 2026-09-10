import { buildSitecoreItemCacheTag, dedupeSitecoreCacheTags } from './sitecore-cache-tags';

/**
 * One content change entry as commonly seen in Experience Edge / Content Operations style payloads.
 * Field names follow community OSR examples; production payloads may include additional fields.
 * @internal
 */
export type SitecoreEdgeRevalidateUpdate = {
  identifier?: string;
  entity_definition?: string;
  operation?: string;
  entity_culture?: string;
};

/**
 * Request body shape for webhook-driven revalidation.
 * @internal
 */
export type SitecoreEdgeRevalidateRequestBody = {
  invocation_id?: string;
  updates?: SitecoreEdgeRevalidateUpdate[];
  continues?: boolean;
};

/**
 * Strips Experience Edge style suffixes from an `identifier` so the value can be used as an item id in cache tags.
 * Handles `{GUID}`, `{GUID}-media`, `{GUID}-layout` style strings.
 * @param {string} identifier - Raw identifier from a webhook update row.
 * @internal
 */
export function extractSitecoreEdgeContentId(identifier: string): string {
  if (!identifier || typeof identifier !== 'string') {
    return '';
  }
  const trimmed = identifier.trim();
  return trimmed.replace(/-(?:media|layout)$/i, '');
}

/**
 * Options for {@link collectSitecoreTagsFromEdgeRevalidateRequestBody}.
 * @internal
 */
export type CollectSitecoreTagsFromEdgeBodyOptions = {
  /**
   * Used when an update omits `entity_culture`.
   */
  defaultLocale: string;
};

/**
 * Maps an Experience Edge webhook JSON body to Content SDK cache tag strings used by
 * {@link collectSitecorePageCacheTags} / {@link buildSitecoreItemCacheTag} (`sc:item:...`), so
 * `revalidateTag` matches tags registered during cached reads.
 * **`updates`** rows resolve to **`sc:item:…`** (locale from `entity_culture` or `defaultLocale`). Route/variant tags are not inferred.
 * @param {SitecoreEdgeRevalidateRequestBody | null | undefined} body - Webhook JSON body (updates).
 * @param {CollectSitecoreTagsFromEdgeBodyOptions} options - Default locale when culture is missing on an update.
 * @internal
 */
export function collectSitecoreTagsFromEdgeRevalidateRequestBody(
  body: SitecoreEdgeRevalidateRequestBody | null | undefined,
  options: CollectSitecoreTagsFromEdgeBodyOptions
): string[] {
  const { defaultLocale } = options;
  const out: string[] = [];

  for (const u of body?.updates ?? []) {
    const id = extractSitecoreEdgeContentId(u?.identifier ?? '');
    if (!id) {
      continue;
    }
    const locale = u?.entity_culture?.trim() || defaultLocale;
    out.push(buildSitecoreItemCacheTag({ itemId: id, locale }));
  }

  return dedupeSitecoreCacheTags(out).filter(Boolean);
}
