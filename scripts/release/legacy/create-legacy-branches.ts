/**
 * One legacy branch per product, `release/legacy/<product>`: the product's previous major, for
 * maintenance releases (`createLegacyBranchesOnMajor` in `post-release-sync.ts`).
 *
 * When a full (dev) or `release/latest` release publishes a new major of a product's own package
 * (`x.0.0`), the branch is (re)created at the `latest` tag (`LATEST_RELEASE_TAG`): the previous
 * release, which `publish.yml` moves to this release only after the post-release sync. Not
 * `release/latest` nor the release commit's parent: they can hold the new major's code. It replaces
 * the branch of the major before (force-push); its releases stay on npm and in their tags.
 *
 * 1. `getMajorPublishedProducts`: products whose own package was published as `x.0.0`;
 * 2. `getProductPackages`: the packages the product's legacy branch keeps;
 * 3. `getPreviousMajor`: checks out the `latest` tag; skipped when the branch already holds it (a
 *    re-run);
 * 4. `trimLegacyBranch`: keeps only the product's packages (`.changeset/products.config.json`) plus
 *    `create-content-sdk-app`; every other workspace package is deleted and resolves from npm,
 *    exactly as for consumers of the legacy product, to avoid version conflicts with non-product
 *    packages in other branches. Commits and force-pushes the branch.
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';
import { readProducts, type Products } from '../../changesets/utils';
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

/** A legacy branch checked out at the `latest` tag (`source`: its commit). */
export interface LegacyBranch {
  slug: string;
  branch: string;
  source: string;
}

/** A product's own package (`products.json` key `nextjs` -> `@sitecore-content-sdk/nextjs`). */
export const productPackage = (slug: string): string => `${SDK_SCOPE}${slug}`;

/** Products whose own package was published as a new major: `x.0.0`, not a prerelease. */
export function getMajorPublishedProducts(
  products: Products,
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

/** Packages a product's legacy branch keeps: its own and the scaffolder. Throws on an unknown one. */
export function getProductPackages(products: Products, slug: string): string[] {
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
 * Returns null, without checking out, when the branch already holds it: created from this previous
 * release already (idempotent). A branch of an older major doesn't, and is replaced.
 */
export function getPreviousMajor(slug: string): LegacyBranch | null {
  const branch = `release/legacy/${slug}`;
  const source = git('rev-parse', `refs/tags/${LATEST_RELEASE_TAG}^{commit}`);
  if (
    tryGit('fetch', '-q', 'origin', branch) !== null &&
    tryGit('merge-base', '--is-ancestor', source, `origin/${branch}`) !== null
  ) {
    console.log(`${branch} already holds ${LATEST_RELEASE_TAG} (${source.slice(0, 7)}); skipping.`);
    return null;
  }
  git('checkout', '-q', '-f', '--detach', source);
  console.log(`Creating ${branch} from ${LATEST_RELEASE_TAG} (${source.slice(0, 7)})`);
  return { slug, branch, source };
}

/**
 * Trims the checked-out legacy branch to the `kept` packages (see header), commits and force-pushes
 * it (replacing the previous major's branch).
 */
export async function trimLegacyBranch(
  { slug, branch, source }: LegacyBranch,
  kept: string[]
): Promise<void> {
  const { packages, rootDir } = await getPackages(process.cwd());
  // whole directories, untracked content included (build output, node_modules): left in place, a
  // workspace would still be found and land in the committed lockfile
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
  const subject = `[ci] Legacy ${slug} branch from ${source.slice(0, 7)}: product packages only`;
  git('commit', '-q', '-m', subject, '-m', summary);
  git('push', '-f', 'origin', `HEAD:refs/heads/${branch}`);
  console.log(`  ${summary}`);
}

/**
 * Refreshes the lockfile of every legacy branch: the Content SDK packages it resolves from npm move
 * to their newest in-range releases (as its consumers install them); workspace packages stay as
 * they are. Commits and pushes `yarn.lock` when it changed (`[skip ci]`: no legacy canary or
 * release run). Checks each branch out in place, then returns to the initial branch.
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

  const initial = tryGit('symbolic-ref', '-q', '--short', 'HEAD') ?? git('rev-parse', 'HEAD');
  try {
    for (const remoteBranch of branches) {
      const branch = remoteBranch.replace(/^origin\//, '');
      git('checkout', '-q', '-f', '--detach', remoteBranch);
      execFileSync('yarn', ['up', '-R', `${SDK_SCOPE}*`, '--mode=update-lockfile'], {
        stdio: 'inherit',
        env: { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: 'false' },
        shell: process.platform === 'win32',
      });
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
  } finally {
    git('checkout', '-q', '-f', initial);
  }
}

/** (Re)creates the legacy branch of every product published as a new major (see header). */
export async function createLegacyBranches(published: PackageVersion[]): Promise<void> {
  // the current product definitions, read from the published commit
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

  const originalSha = git('rev-parse', 'HEAD');
  for (const slug of majors) {
    const legacy = getPreviousMajor(slug);
    if (!legacy) continue;
    try {
      await trimLegacyBranch(legacy, getProductPackages(products, slug));
      console.log(`✅ Created ${legacy.branch}.`);
    } finally {
      git('checkout', '-q', '-f', '--detach', originalSha);
    }
  }
}
