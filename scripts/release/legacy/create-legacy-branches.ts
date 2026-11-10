/**
 * One legacy branch per product, `release/legacy/<product>`: the product's previous major
 *
 * When a full (dev) or `release/latest` release publishes a new major of a product's own package
 * (`x.0.0`), the branch is (re)created at the `latest` tag (`LATEST_RELEASE_TAG`): the previous
 * release (`moveLatestTag` in the post-release sync moves it to this release). Not
 * `release/latest` nor the release commit's parent: they can hold the new major's code. It replaces
 * the branch of the major before (force-push); its releases stay on npm and in their tags.
 *
 * The branch keeps only the product's packages and the scaffolder: every other workspace package
 * resolves from npm, as for the legacy product's consumers, so it can't conflict with the versions
 * of non-product packages on other branches.
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readFileSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';
import { readProducts } from '../../changesets/utils';
import {
  CHANGESET_CONFIG_PATH,
  LATEST_RELEASE_TAG,
  PRODUCTS_PATH,
  SCAFFOLDER,
  SDK_SCOPE,
} from '../../constants';
import {
  git,
  tryGit,
  repoPath,
  updateLockfile,
  type PackageVersion,
  type WorkspacePackage,
} from '../utils';

/**
 * A legacy branch checked out at the `latest` tag (`source`: its commit). `remoteSha`: the branch
 * on origin it replaces, null when there is none.
 */
interface LegacyBranch {
  slug: string;
  branch: string;
  source: string;
  remoteSha: string | null;
}

/** A product's own package (`products.config.json` key `nextjs` -> `@sitecore-content-sdk/nextjs`). */
const productPackage = (slug: string): string => `${SDK_SCOPE}${slug}`;

/** Products whose own package was published as a new major: `x.0.0`, not a prerelease. */
export function getMajorPublishedProducts(
  products: Record<string, string[]>,
  published: PackageVersion[]
): string[] {
  return Object.keys(products).filter((slug) => {
    const version = published.find((p) => p.name === productPackage(slug))?.version;
    const parsed = version ? semver.parse(version) : null;
    return (
      !!parsed &&
      parsed.major > 0 &&
      parsed.minor === 0 &&
      parsed.patch === 0 &&
      parsed.prerelease.length === 0
    );
  });
}

/** Packages a product's legacy branch keeps: products + scaffolder. Throws on an unknown one. */
export function getProductPackages(products: Record<string, string[]>, slug: string): string[] {
  const productPackages = products[slug];
  if (!productPackages) {
    throw new Error(`Product "${slug}" is not defined in ${PRODUCTS_PATH}.`);
  }
  return [...productPackages, SCAFFOLDER];
}

/** Repo-relative directories of the workspace packages a legacy branch drops (all but `kept`). */
export function legacyPrunedDirs(
  packages: WorkspacePackage[],
  rootDir: string,
  kept: string[]
): string[] {
  const keep = new Set(kept);
  return packages
    .filter((pkg) => !keep.has(pkg.packageJson.name))
    .map((pkg) => repoPath(rootDir, pkg.dir));
}

/**
 * Checks out (detached) the previous release, the `latest` tag, for the product's legacy branch.
 * Throws when the tag is not on an older major of the product: moved to this release (or a later
 * one) already. Returns null, without checking out, when the branch already holds it: created from
 * this previous release already (idempotent). A branch of an older major doesn't, and is replaced.
 */
export function checkoutLegacySource(slug: string, publishedMajor: number): LegacyBranch | null {
  const branch = `release/legacy/${slug}`;
  const source = git('rev-parse', `refs/tags/${LATEST_RELEASE_TAG}^{commit}`);
  const tagManifest = git('show', `${source}:packages/${slug}/package.json`);
  const tagVersion: string = JSON.parse(tagManifest).version;
  if (semver.major(tagVersion) >= publishedMajor) {
    console.error(
      `Cannot create legacy branch. '${LATEST_RELEASE_TAG}' tag points to the fresh release instead of the previous major.` +
        ` If tag was moved, point it at the previous release and re-run.` +
        ` If this is a re-run after a later release, ignore this error.`
    );
    return null;
  }
  let remoteSha: string | null = null;
  if (branchExists(branch)) {
    git('fetch', '-q', 'origin', branch);
    remoteSha = git('rev-parse', `origin/${branch}`);
    if (tryGit('merge-base', '--is-ancestor', source, remoteSha) !== null) {
      console.log(
        `${branch} already holds ${LATEST_RELEASE_TAG} (${source.slice(0, 7)}); skipping.`
      );
      return null;
    }
  }
  git('checkout', '-q', '-f', '--detach', source);
  console.log(`Script will create ${branch} from ${LATEST_RELEASE_TAG} (${source.slice(0, 7)})`);
  return { slug, branch, source, remoteSha };
}

/**
 * Whether origin has the branch: false only when `ls-remote` exits with 2 (no such branch).
 * Throws on any other failure (network, auth), never mistaken for a missing branch.
 */
export function branchExists(branch: string): boolean {
  try {
    git('ls-remote', '--exit-code', '--heads', 'origin', branch);
    return true;
  } catch (error) {
    if ((error as { status?: number }).status === 2) return false;
    throw error;
  }
}

/**
 * Trims the checked-out legacy branch to the `kept` packages (see header), commits and force-pushes
 * it (replacing the previous major's branch).
 */
export async function trimLegacyBranch(
  { slug, branch, source, remoteSha }: LegacyBranch,
  kept: string[]
): Promise<void> {
  const { packages, rootDir } = await getPackages(process.cwd());
  // whole directories with untracked build output and node_modules
  const pruned = legacyPrunedDirs(packages, rootDir, kept);
  for (const dir of pruned) rmSync(path.join(rootDir, dir), { recursive: true, force: true });

  // a legacy release never publishes the scaffolder - but we still need it for dev work in legacy
  const configPath = path.join(rootDir, CHANGESET_CONFIG_PATH);
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  config.ignore = [...new Set([...(config.ignore ?? []), SCAFFOLDER])];
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

  updateLockfile();
  // tracked changes only: the deletions, the changesets config, yarn.lock
  git('add', '-u');
  const summary =
    `Kept: ${kept.join(', ')} (${SCAFFOLDER} ignored by changesets). ` +
    `Removed (resolved from npm): ${pruned.join(', ') || 'none'}.`;
  const subject =
    `[ci] Legacy ${slug} branch from ${source.slice(0, 7)}: ` + 'product packages only [skip ci]';
  git('commit', '-q', '-m', subject, '-m', summary);
  // replaces only the branch seen by checkoutLegacySource (empty lease: must not exist yet)
  git(
    'push',
    `--force-with-lease=refs/heads/${branch}:${remoteSha ?? ''}`,
    'origin',
    `HEAD:refs/heads/${branch}`
  );
  console.log(`  ${summary}`);
}

/**
 * Refreshes the lockfile of every legacy branch: the Content SDK packages it resolves from npm move
 * to their newest in-range releases (as its consumers install them); workspace packages stay as
 * they are. Commits and pushes `yarn.lock` when it changed (`[skip ci]`: no legacy canary or
 * release run). Checks each branch out in place.
 */
export async function refreshLegacyLockfiles(): Promise<void> {
  git('fetch', '-q', 'origin', 'refs/heads/release/legacy/*:refs/remotes/origin/release/legacy/*');
  const branches = git(
    'branch',
    '-r',
    '--format=%(refname:short)',
    '--list',
    'origin/release/legacy/*'
  )
    .split('\n')
    .filter(Boolean);

  for (const remoteBranch of branches) {
    const branch = remoteBranch.replace(/^origin\//, '');
    git('checkout', '-q', '-f', '--detach', remoteBranch);
    updateLockfile('up', '-R', `${SDK_SCOPE}*`);
    if (
      tryGit(
        'commit',
        '-q',
        '-m',
        '[ci][legacy] Refresh yarn.lock [skip ci]',
        '--',
        'yarn.lock'
      ) === null
    ) {
      console.log(`${branch}: yarn.lock already up to date.`);
      continue;
    }
    git('push', 'origin', `HEAD:refs/heads/${branch}`);
    console.log(`✅ ${branch}: refreshed yarn.lock pushed.`);
  }
}

/** `products.config.json` at the commit; null when it predates the file. */
function productsAt(commit: string): Record<string, string[]> | null {
  const config = tryGit('show', `${commit}:${PRODUCTS_PATH}`);
  return config === null ? null : JSON.parse(config);
}

/** (Re)creates the legacy branch of every product published as a new major (see header). */
export async function createLegacyBranches(published: PackageVersion[]): Promise<void> {
  // the current product definitions, read from the published commit: which products got a major
  const products = readProducts(process.cwd());
  const majors = getMajorPublishedProducts(products, published);
  if (majors.length === 0) {
    console.log('No product major in this release; no legacy branches.');
    return;
  }
  // the tag moves: replace the local one
  const tagRef = `refs/tags/${LATEST_RELEASE_TAG}`;
  if (tryGit('fetch', '-q', '-f', 'origin', `${tagRef}:${tagRef}`) === null) {
    console.log(
      `No ${LATEST_RELEASE_TAG} tag on origin yet (no previous release); no legacy branches.`
    );
    return;
  }

  for (const slug of majors) {
    const version = published.find((p) => p.name === productPackage(slug))!.version;
    const legacy = checkoutLegacySource(slug, semver.major(version));
    if (!legacy) continue;
    // the previous major's own product definitions: the new release may have moved packages
    const previousProducts = productsAt(legacy.source) ?? products;
    await trimLegacyBranch(legacy, getProductPackages(previousProducts, slug));
    console.log(`✅ Created ${legacy.branch}.`);
  }
}
