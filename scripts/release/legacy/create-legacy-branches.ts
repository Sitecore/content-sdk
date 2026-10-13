/**
 * Creates a legacy maintenance branch when a product package (nextjs or angular) has just
 * received a major-version bump on the mainline release.
 *
 * Called by `post-release-sync.ts` after a stable publish, with the release's published packages.
 *
 * For each configured product published with a higher major than the one on `release/latest`, this
 * branches `release/latest` into `release/legacy/<slug>/v<major on release/latest>`.
 * `release/latest` holds the latest released code of every package, so the branch starts from the
 * product's last release of the previous major, with the tooling of the last full release.
 * `post-release-sync.ts` runs this before it moves `release/latest` to the new release (and doesn't
 * move it when this fails), so `release/latest` still holds the previous major, also on a re-run.
 *
 * The branch holds only the product's packages (`.changeset/products.json`) plus
 * `create-content-sdk-app`; every other workspace package is deleted from it and resolves from npm,
 * exactly as for consumers of the legacy product (P1). Otherwise the branch would keep the shared
 * packages' code from the tag while consumers run dev's newer in-range releases.
 * `create-content-sdk-app` stays for scaffolding samples in CI but is never published from a legacy
 * line (added to `.changeset/config.json` `ignore`). The pruning is one commit on top of
 * `release/latest`.
 *
 * Idempotent: skips creation when the target branch already exists on origin. Pushes use the
 * `origin` remote configured earlier in the workflow (authenticated via the GitHub App token).
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';
import { readProducts, type Products } from '../../changesets/utils';
import { RELEASE_LATEST } from '../sync-latest-branch';
import {
  git,
  repoPath,
  updateLockfile,
  versionsAt,
  type PackageVersion,
  type WorkspacePackage,
} from '../release-state';

/** Kept on every legacy branch (scaffolding samples in CI) but never published from it. */
export const SCAFFOLDER = 'create-content-sdk-app';
const CONFIG_PATH = '.changeset/config.json';

/** What to do for a product after a publish: create a legacy branch, or skip (with a reason). */
export type LegacyBranchPlan =
  | { action: 'create'; targetBranch: string; previousMajor: number }
  | { action: 'skip'; reason: string };

/** A product's own package (`products.json` key `nextjs` -> `@sitecore-content-sdk/nextjs`). */
export const productPackage = (slug: string): string => `@sitecore-content-sdk/${slug}`;

export const legacyBranch = (slug: string, major: number): string =>
  `release/legacy/${slug}/v${major}`;

/**
 * Decides whether a product needs a legacy branch after publishing `publishedVersion`: when its
 * major is above the product's major on `release/latest` (the previous release), the branch keeps
 * that previous major.
 * @param slug - product slug used in the branch path
 * @param publishedVersion - version just published
 * @param versionOnLatest - the product's version on `release/latest` (undefined: never released)
 */
export function planLegacyBranch(
  slug: string,
  publishedVersion: string,
  versionOnLatest: string | undefined
): LegacyBranchPlan {
  if (!versionOnLatest) {
    return { action: 'skip', reason: `not on ${RELEASE_LATEST} (no prior release)` };
  }
  const previousMajor = semver.major(versionOnLatest);
  if (semver.major(publishedVersion) <= previousMajor) {
    return {
      action: 'skip',
      reason: `published ${publishedVersion} is not a major bump over ${versionOnLatest} on ${RELEASE_LATEST}`,
    };
  }
  return { action: 'create', targetBranch: legacyBranch(slug, previousMajor), previousMajor };
}

/**
 * Repo-relative directories of the workspace packages a legacy branch drops: everything except the
 * product's packages and the scaffolder. Throws when the product is unknown.
 */
export function legacyPrunedDirs(
  packages: WorkspacePackage[],
  rootDir: string,
  products: Products,
  slug: string
): string[] {
  const productPackages = products[slug];
  if (!productPackages) {
    throw new Error(`Product "${slug}" is not defined in .changeset/products.json.`);
  }
  const keep = new Set([...productPackages, SCAFFOLDER]);
  return packages
    .filter((pkg) => !keep.has(pkg.packageJson.name))
    .map((pkg) => repoPath(rootDir, pkg.dir));
}

/** Changesets config with the scaffolder ignored (a legacy line never publishes it). */
export function withScaffolderIgnored<T extends { ignore?: string[] }>(config: T): T {
  const ignore = config.ignore ?? [];
  return ignore.includes(SCAFFOLDER) ? config : { ...config, ignore: [...ignore, SCAFFOLDER] };
}

/**
 * Cuts `targetBranch` from `sourceSha` with only the product's packages (see header), commits and
 * pushes it. Returns to the commit checked out before.
 */
async function createPrunedLegacyBranch(
  products: Products,
  slug: string,
  sourceSha: string,
  source: string,
  targetBranch: string
): Promise<void> {
  const originalSha = git('rev-parse', 'HEAD');
  git('checkout', '-q', '-f', '--detach', sourceSha);
  try {
    const { packages, rootDir } = await getPackages(process.cwd());
    // committed packages only: `samples/*` workspaces are generated (scaffold-samples), not tracked
    const tracked = new Set(git('ls-files', '--', '*package.json').split('\n'));
    const committed = packages.filter((pkg) =>
      tracked.has(repoPath(rootDir, path.join(pkg.dir, 'package.json')))
    );
    const pruned = legacyPrunedDirs(committed, rootDir, products, slug);
    if (pruned.length > 0) git('rm', '-r', '-q', '--', ...pruned);
    // Untracked leftovers: build output and per-package node_modules from the publish run, and
    // generated workspaces (samples). Left in place, yarn would write their dependencies into the
    // committed lockfile and `yarn install --immutable` would fail on a fresh clone of the branch.
    const generated = packages
      .filter((pkg) => !committed.includes(pkg))
      .map((pkg) => repoPath(rootDir, pkg.dir));
    const leftovers = [...pruned, ...generated];
    if (leftovers.length > 0) git('clean', '-fdxq', '--', ...leftovers);

    const configPath = path.join(rootDir, CONFIG_PATH);
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    writeFileSync(
      configPath,
      `${JSON.stringify(withScaffolderIgnored(config), null, 2)}\n`,
      'utf8'
    );

    updateLockfile();
    git('add', '--', CONFIG_PATH, 'yarn.lock');
    git(
      'commit',
      '-q',
      '-m',
      `[ci] Legacy ${slug} branch from ${source}: product packages only\n\n` +
        `Removed (resolved from npm): ${pruned.join(', ') || 'none'}. ` +
        `${SCAFFOLDER} is kept for scaffolding but ignored by changesets.`
    );
    git('push', 'origin', `HEAD:refs/heads/${targetBranch}`);
    console.log(
      `  removed ${pruned.join(', ')}; kept ${[...products[slug], SCAFFOLDER].join(', ')}`
    );
  } finally {
    git('checkout', '-q', '-f', '--detach', originalSha);
  }
}

function branchExistsOnRemote(branch: string): boolean {
  return git('ls-remote', '--heads', 'origin', branch).length > 0;
}

/**
 * Creates the legacy branch of every product whose published version is a new major (see header).
 * Idempotent: an existing branch is left alone.
 */
export async function createLegacyBranches(published: PackageVersion[]): Promise<void> {
  // the current product definitions, read from the published commit
  const products = readProducts(process.cwd());
  const releasedProducts = Object.keys(products).filter((slug) =>
    published.some((p) => p.name === productPackage(slug))
  );
  if (releasedProducts.length === 0) return;

  try {
    git('fetch', 'origin', RELEASE_LATEST);
  } catch {
    console.log(`${RELEASE_LATEST} doesn't exist yet (no prior release); no legacy branches.`);
    return;
  }
  const latestRef = `origin/${RELEASE_LATEST}`;
  const latestVersions = await versionsAt(latestRef);

  for (const slug of releasedProducts) {
    const name = productPackage(slug);
    const version = published.find((p) => p.name === name)!.version;
    const versionOnLatest = latestVersions.get(name);
    const plan = planLegacyBranch(slug, version, versionOnLatest);

    if (plan.action === 'skip') {
      console.log(`${name}: ${plan.reason}; skipping.`);
      continue;
    }

    if (branchExistsOnRemote(plan.targetBranch)) {
      console.log(`${plan.targetBranch} already exists on origin; skipping creation.`);
      continue;
    }

    const sourceSha = git('rev-parse', latestRef);
    const source = `${RELEASE_LATEST} (${name}@${versionOnLatest})`;
    console.log(`Creating ${plan.targetBranch} from ${source} at ${sourceSha.slice(0, 7)}`);
    await createPrunedLegacyBranch(products, slug, sourceSha, source, plan.targetBranch);
  }

  console.log('✅ Legacy branch maintenance complete.');
}
