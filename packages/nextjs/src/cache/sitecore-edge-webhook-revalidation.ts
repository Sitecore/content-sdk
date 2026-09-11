import {
  buildSitecoreDictionaryCacheTag,
  buildSitecoreItemCacheTag,
  dedupeSitecoreCacheTags,
} from './sitecore-cache-tags';
import debug from '../debug';

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
 * `entity_definition` value Experience Edge sends for Dictionary entry updates, matched case-insensitively.
 * @internal
 */
const DICTIONARY_ENTRY_ENTITY_DEFINITION = 'DictionaryEntry';

/**
 * Whether a webhook update row is a Dictionary entry change (`entity_definition: "DictionaryEntry"`).
 * @param {string} [entityDefinition] - `entity_definition` from a webhook update row.
 * @internal
 */
export function isSitecoreDictionaryEntryUpdate(entityDefinition?: string): boolean {
  return entityDefinition === DICTIONARY_ENTRY_ENTITY_DEFINITION;
}

/**
 * Resolves which configured site a Dictionary entry webhook `identifier` belongs to.
 *
 * Dictionary identifiers follow `<site name>-<dictionary folder id>-<value>-<language>`, but the
 * folder id, value, and language segments can themselves contain hyphens (and the value can contain
 * spaces), so splitting the identifier on `-` is not reliable. Instead this matches the identifier
 * against the known configured site names, preferring the longest name so a more specific name wins
 * over a shorter overlapping one (e.g. `my-site-2` over `my-site`).
 * @param {string} identifier - Raw `identifier` from a Dictionary entry update row.
 * @param {string[]} siteNames - Configured site names (e.g. from `.sitecore/sites.json`).
 * @returns The matched site name, or `undefined` when no configured site name prefixes `identifier`.
 * @internal
 */
export function resolveSitecoreDictionarySiteNameFromIdentifier(
  identifier: string,
  siteNames: readonly string[]
): string | undefined {
  const normalized = identifier.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  const byLengthDesc = [...siteNames].sort((a, b) => b.length - a.length);
  for (const siteName of byLengthDesc) {
    const prefix = `${siteName.trim().toLowerCase()}-`;
    if (prefix.length > 1 && normalized.startsWith(prefix)) {
      return siteName;
    }
  }
  return undefined;
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
  /**
   * Configured site names (e.g. from `.sitecore/sites.json`), used only to resolve which site a
   * Dictionary entry update (`entity_definition: "DictionaryEntry"`) belongs to. When omitted (or when
   * an identifier matches none of them), that update's Dictionary tag is skipped rather than guessed.
   */
  siteNames?: readonly string[];
};

/**
 * Maps an Experience Edge webhook JSON body to Content SDK cache tag strings used by
 * {@link collectSitecorePageCacheTags} / {@link buildSitecoreItemCacheTag} (`sc:item:...`), so
 * `revalidateTag` matches tags registered during cached reads.
 * **`updates`** rows resolve to **`sc:item:…`** (locale from `entity_culture` or `defaultLocale`), except
 * rows where `entity_definition` is `"DictionaryEntry"`, which resolve to **`sc:dict:…`** scoped to the
 * site resolved from the identifier (see {@link resolveSitecoreDictionarySiteNameFromIdentifier}) and the
 * same locale. Route/variant tags are not inferred.
 * @param {SitecoreEdgeRevalidateRequestBody | null | undefined} body - Webhook JSON body (updates).
 * @param {CollectSitecoreTagsFromEdgeBodyOptions} options - Default locale, and site names for Dictionary entry updates.
 * @internal
 */
export function collectSitecoreTagsFromEdgeRevalidateRequestBody(
  body: SitecoreEdgeRevalidateRequestBody | null | undefined,
  options: CollectSitecoreTagsFromEdgeBodyOptions
): string[] {
  const { defaultLocale, siteNames = [] } = options;
  const out: string[] = [];

  for (const u of body?.updates ?? []) {
    const locale = u?.entity_culture?.trim() || defaultLocale;

    if (isSitecoreDictionaryEntryUpdate(u?.entity_definition)) {
      const identifier = u?.identifier ?? '';
      const site = resolveSitecoreDictionarySiteNameFromIdentifier(identifier, siteNames);

      if (!site) {
        debug.revalidate(
          'could not resolve site for Dictionary entry identifier %o, skipping',
          identifier
        );

        continue;
      }

      out.push(buildSitecoreDictionaryCacheTag({ site, locale }));

      continue;
    }

    const id = extractSitecoreEdgeContentId(u?.identifier ?? '');
    if (!id) {
      continue;
    }
    out.push(buildSitecoreItemCacheTag({ itemId: id, locale }));
  }

  return dedupeSitecoreCacheTags(out).filter(Boolean);
}
