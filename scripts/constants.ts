/**
 * Constants shared by the changesets and release scripts (`scripts/changesets`, `scripts/release`).
 */

/** GitHub repository, for commit links in changelogs. */
export const REPO = 'sitecore/content-sdk';

/**
 * The app scaffolder: released with every product (listed under each in `products.config.json`),
 * patch-only in the cascade.
 */
export const SCAFFOLDER = 'create-content-sdk-app';

/** Product -> packages (`readProducts`). */
export const PRODUCTS_PATH = '.changeset/products.config.json';
