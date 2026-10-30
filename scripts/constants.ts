/**
 * Constants shared by the changesets and release scripts (`scripts/changesets`, `scripts/release`).
 */

/** GitHub repository, for commit links in changelogs. */
export const REPO = 'sitecore/content-sdk';

/** npm scope of the Content SDK packages; a product's own package is `<scope><product>`. */
export const SDK_SCOPE = '@sitecore-content-sdk/';

/**
 * The app scaffolder: in no product in `products.config.json`, so it is shared and released with
 * either product; patch-only in the cascade, kept but never published on legacy branches.
 */
export const SCAFFOLDER = 'create-content-sdk-app';

/** Changesets config. */
export const CHANGESET_CONFIG_PATH = '.changeset/config.json';

/** Product -> packages (`readProducts`). */
export const PRODUCTS_PATH = '.changeset/products.config.json';

/** The main branch: full releases. */
export const MAIN_BRANCH = 'dev';

/**
 * Limited, hotfix and feature releases are made on it; re-created at each full release. Between
 * releases it can hold code not released yet (a limited copy, cherry-picked fixes).
 */
export const RELEASE_LATEST = 'release/latest';

/**
 * Git tag on the latest release commit of dev or `release/latest` (moved by `publish.yml` after the
 * post-release sync): the released code, which legacy branches are cut from.
 */
export const LATEST_RELEASE_TAG = 'latest';
