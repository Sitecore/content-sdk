import {
  SITECORE_CONTENT_CACHE_TAG_PREFIX,
  buildSitecoreItemCacheTag,
  dedupeSitecoreCacheTags,
} from './sitecore-cache-tags';

/**
 * One content change entry as commonly seen in Experience Edge / Content Operations style payloads (POC shape).
 * Field names follow community OSR examples; production payloads may include additional fields.
 * @public
 */
export type SitecoreEdgeRevalidateUpdate = {
  identifier?: string;
  entity_definition?: string;
  operation?: string;
  entity_culture?: string;
};

/**
 * Request body shape for webhook-driven revalidation (POC-aligned).
 * @public
 */
export type SitecoreEdgeRevalidateRequestBody = {
  invocation_id?: string;
  updates?: SitecoreEdgeRevalidateUpdate[];
  continues?: boolean;
  /**
   * Extra tag strings. Values starting with the Sitecore cache prefix (`sc:`) are used as-is.
   * Bare values are treated as Sitecore item ids (with optional `-media` / `-layout` suffix stripped)
   * and mapped to {@link buildSitecoreItemCacheTag} using the handler default locale when culture is missing.
   */
  tags?: string[];
};

/**
 * Strips Experience Edge style suffixes from an `identifier` so the value can be used as an item id in cache tags.
 * Handles `{GUID}`, `{GUID}-media`, `{GUID}-layout` style strings.
 * @param {string} identifier - Raw identifier from a webhook update row.
 * @public
 */
export function extractSitecoreEdgeContentId(identifier: string): string {
  if (!identifier || typeof identifier !== 'string') {
    return '';
  }
  const trimmed = identifier.trim();
  return trimmed.replace(/-(?:media|layout)$/i, '');
}

const FULL_TAG_PREFIX = `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:`;

/**
 * @param {string} value - Candidate tag string from a webhook body.
 * @returns True when `value` is already a full `sc:` content cache tag.
 */
function isFullSitecoreContentCacheTag(value: string): boolean {
  return value.startsWith(FULL_TAG_PREFIX);
}

/**
 * Options for {@link collectSitecoreTagsFromEdgeRevalidateRequestBody}.
 * @public
 */
export type CollectSitecoreTagsFromEdgeBodyOptions = {
  /**
   * Used when an update omits `entity_culture`, and when mapping bare item ids in `tags`.
   */
  defaultLocale: string;
};

/**
 * Maps a POC-style Edge webhook JSON body to Content SDK cache tag strings used by
 * {@link collectSitecorePageCacheTags} / {@link buildSitecoreItemCacheTag} (`sc:item:...`), so
 * `revalidateTag` matches tags registered during cached reads.
 * **`updates`** rows resolve to **`sc:item:…`** (locale from `entity_culture` or `defaultLocale`). **`tags`**: full `sc:` strings pass through; bare ids become **`sc:item:…`** with `defaultLocale`. Route/variant tags are not inferred.
 * @param {SitecoreEdgeRevalidateRequestBody | null | undefined} body - Webhook JSON body (tags and/or updates).
 * @param {CollectSitecoreTagsFromEdgeBodyOptions} options - Default locale when culture is missing on an update or bare tag.
 * @public
 */
export function collectSitecoreTagsFromEdgeRevalidateRequestBody(
  body: SitecoreEdgeRevalidateRequestBody | null | undefined,
  options: CollectSitecoreTagsFromEdgeBodyOptions
): string[] {
  const { defaultLocale } = options;
  const out: string[] = [];

  for (const raw of body?.tags ?? []) {
    if (typeof raw !== 'string') {
      continue;
    }
    const s = raw.trim();
    if (!s) {
      continue;
    }
    if (isFullSitecoreContentCacheTag(s)) {
      out.push(s);
    } else {
      const id = extractSitecoreEdgeContentId(s);
      if (id) {
        out.push(buildSitecoreItemCacheTag({ itemId: id, locale: defaultLocale }));
      }
    }
  }

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
