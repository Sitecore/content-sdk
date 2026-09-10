import { buildSitecoreItemCacheTag } from '../cache/cache-tags';
import { dedupeCacheStrings } from '../cache/utils';

/**
 * One content change entry as commonly seen in Experience Edge / Content Operations payloads.
 * @public
 */
export type SitecoreEdgeRevalidateUpdate = {
  identifier?: string;
  entity_definition?: string;
  operation?: string;
  entity_culture?: string;
};

/**
 * Request body shape for webhook-driven revalidation.
 * @public
 */
export type SitecoreEdgeRevalidateRequestBody = {
  invocation_id?: string;
  updates?: SitecoreEdgeRevalidateUpdate[];
  continues?: boolean;
};

/**
 * Strips Experience Edge style suffixes from an `identifier`.
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

/**
 * Options for {@link collectSitecoreTagsFromEdgeRevalidateRequestBody}.
 * @public
 */
export type CollectSitecoreTagsFromEdgeBodyOptions = {
  defaultLocale: string;
};

/**
 * Maps an Experience Edge webhook JSON body to Sitecore cache tag strings.
 *
 * Accepts `updates[]` rows with `identifier` (with optional `-media`/`-layout` suffixes) + `entity_culture`.
 * @param {SitecoreEdgeRevalidateRequestBody | null | undefined} body - Parsed webhook JSON body.
 * @param {CollectSitecoreTagsFromEdgeBodyOptions} options - Locale fallback when an update omits `entity_culture`.
 * @returns {string[]} Deduplicated Sitecore cache tags ready for `LoaderCache.invalidate`.
 * @public
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

  return dedupeCacheStrings(out).filter(Boolean);
}
