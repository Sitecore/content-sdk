import { ImportMapImport } from './models';

/**
 * No-op import map loader used when code generation is disabled or no import map is available.
 * @returns {Promise<ImportMapImport>} A promise that resolves to an empty import map.
 * @public
 */
export const noopLoadImportMap = (): Promise<ImportMapImport> => Promise.resolve({ default: [] });
