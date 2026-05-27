import { buildSitecoreItemCacheTag, SITECORE_CONTENT_CACHE_TAG_PREFIX } from '../cache/cache-tags';
import { dedupeCacheStrings } from '../cache/utils';

/**
 * One content change entry as commonly seen in Experience Edge / Content Operations payloads.
 * Authority: `packages/nextjs/src/cache/sitecore-edge-webhook-revalidation.ts`.
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
  tags?: string[];
};

/**
 * Strips Experience Edge style suffixes from an `identifier`.
 * Authority: `packages/nextjs/src/cache/sitecore-edge-webhook-revalidation.ts`.
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

function isFullSitecoreContentCacheTag(value: string): boolean {
  return value.startsWith(FULL_TAG_PREFIX);
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
 * Accepts fully qualified `sc:…` tags in `body.tags`, raw content identifiers
 * (with optional `-media`/`-layout` suffixes), and `updates[]` rows with
 * `identifier` + `entity_culture`.
 * Authority: `packages/nextjs/src/cache/sitecore-edge-webhook-revalidation.ts`.
 * @param body - Parsed webhook JSON body.
 * @param options - Locale fallback when an update omits `entity_culture`.
 * @returns Deduplicated Sitecore cache tags ready for {@link LoaderCache.invalidate}.
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

  return dedupeCacheStrings(out).filter(Boolean);
}
