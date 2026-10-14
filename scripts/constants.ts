/**
 * Constants shared by the changesets and release scripts (`scripts/changesets`, `scripts/release`).
 */

/** GitHub repository, for commit links in changelogs. */
export const REPO = 'sitecore/content-sdk';

/** npm scope of the Content SDK packages; a product's own package is `<scope><product>`. */
export const SDK_SCOPE = '@sitecore-content-sdk/';

/**
 * The app scaffolder: released with every product (listed under each in `products.config.json`),
 * patch-only in the cascade, kept but never published on legacy branches.
 */
export const SCAFFOLDER = 'create-content-sdk-app';

/** Changesets config. */
export const CHANGESET_CONFIG_PATH = '.changeset/config.json';

/** Product -> packages (`readProducts`). */
export const PRODUCTS_PATH = '.changeset/products.config.json';

/** The main branch: full releases. */
export const MAIN_BRANCH = 'dev';

/** Strictly released code: re-created / overlaid after every full, limited and hotfix release. */
export const RELEASE_LATEST = 'release/latest';
