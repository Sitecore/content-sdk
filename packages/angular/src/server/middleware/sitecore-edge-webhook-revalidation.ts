import { buildSitecoreDictionaryCacheTag, buildSitecoreItemCacheTag } from '../cache/cache-tags';
import { dedupeCacheStrings } from '../cache/utils';
import debug from '../../debug';

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
 * `entity_definition` value Experience Edge sends for Dictionary entry updates, matched case-insensitively.
 * @internal
 */
const DICTIONARY_ENTRY_ENTITY_DEFINITION = 'dictionaryentry';

/**
 * Whether a webhook update row is a Dictionary entry change (`entity_definition: "DictionaryEntry"`).
 * @param {string} [entityDefinition] - `entity_definition` from a webhook update row.
 * @public
 */
export function isSitecoreDictionaryEntryUpdate(entityDefinition?: string): boolean {
  return (entityDefinition ?? '').trim().toLowerCase() === DICTIONARY_ENTRY_ENTITY_DEFINITION;
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
 * @public
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
 * @public
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
 * Maps an Experience Edge webhook JSON body to Sitecore cache tag strings.
 *
 * Accepts `updates[]` rows with `identifier` (with optional `-media`/`-layout` suffixes) + `entity_culture`,
 * mapped to `sc:item:…` tags — except rows where `entity_definition` is `"DictionaryEntry"`, which map to
 * `sc:dict:<site>:<locale>` for the site resolved from the identifier via `siteNames` (skipped, with a
 * debug log, when no configured site matches). Only updates that are actually Dictionary changes
 * revalidate dictionary tags — a webhook for an unrelated item never touches them.
 * @param {SitecoreEdgeRevalidateRequestBody | null | undefined} body - Parsed webhook JSON body.
 * @param {CollectSitecoreTagsFromEdgeBodyOptions} options - Default locale, and site names for Dictionary entry updates.
 * @returns {string[]} Deduplicated Sitecore cache tags ready for `LoaderCache.invalidate`.
 * @public
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
          'sitecore revalidate: could not resolve site for Dictionary entry identifier %o, skipping',
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

  return dedupeCacheStrings(out).filter(Boolean);
}
