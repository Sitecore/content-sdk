import { ATOMS_CATALOG_METADATA_KEY } from '@sitecore-content-sdk/content/atoms';
import { serializeCatalog } from './catalog-serializer';
import type { AtomsCatalog } from './types';

/**
 * Gets the application metadata section holding the serialized atoms catalog,
 * e.g. `generateMetadata({ customSections: { ...getAtomsMetadata(catalog) } })`.
 * Schemas without a JSON Schema equivalent (e.g. `z.date()`) are serialized as `{}` instead of throwing,
 * so a catalog that cannot be fully serialized does not break loading of the CLI configuration.
 * @param {AtomsCatalog} catalog atoms catalog created with `defineAtomsCatalog`
 * @returns serialized atoms catalog keyed by `ATOMS_CATALOG_METADATA_KEY`
 * @public
 */
export function getAtomsMetadata(
  catalog: AtomsCatalog
): Record<typeof ATOMS_CATALOG_METADATA_KEY, unknown> {
  return { [ATOMS_CATALOG_METADATA_KEY]: serializeCatalog(catalog, { unrepresentable: 'any' }) };
}
