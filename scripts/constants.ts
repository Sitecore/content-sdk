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

/** The main branch: full releases. */
export const MAIN_BRANCH = 'dev';

/**
 * Limited, hotfix and feature releases are made on it; re-created at each full release. Between
 * releases it can hold code not released yet (a limited copy, cherry-picked fixes).
 */
export const RELEASE_LATEST = 'release/latest';
