/**
 * Creates a legacy maintenance branch when a product package has just received a major-version bump
 * in a full (dev) or limited release (`createLegacyBranchesOnMajor` in `post-release-sync.ts`).
 *
 * Branches `release/latest` into `release/legacy/<slug>/v<major on release/latest>`.
 *
 * The branch holds only the product's packages (`.changeset/products.config.json`) plus
 * `create-content-sdk-app`; every other workspace package is deleted from it and resolves from npm,
 * exactly as for consumers of the legacy product to avoid version conflicts with non-product packages
 * in other branches.
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';
import { readProducts, type Products } from '../../changesets/utils';
import {
  CHANGESET_CONFIG_PATH,
  PRODUCTS_PATH,
  RELEASE_LATEST,
  SCAFFOLDER,
  SDK_SCOPE,
} from '../../constants';
import {
  git,
  repoPath,
  tryGit,
  updateLockfile,
  versionsAt,
  type PackageVersion,
  type WorkspacePackage,
} from '../utils';

/** A legacy branch to create: the product and the version on `release/latest` it starts from. */
export interface LegacyBranch {
  slug: string;
  branch: string;
  versionOnLatest: string;
}

/** A product's own package (`products.json` key `nextjs` -> `@sitecore-content-sdk/nextjs`). */
export const productPackage = (slug: string): string => `${SDK_SCOPE}${slug}`;

export const legacyBranch = (slug: string, major: number): string =>
  `release/legacy/${slug}/v${major}`;

/**
 * Products that need a legacy branch: published with a higher major than the one on
 * `release/latest` (the previous release). The branch keeps that previous major. Empty when none.
 */
export function planLegacyBranches(
  products: Products,
  published: PackageVersion[],
  latestVersions: Map<string, string>
): LegacyBranch[] {
  return Object.keys(products).flatMap((slug) => {
    const name = productPackage(slug);
    const version = published.find((p) => p.name === name)?.version;
    const versionOnLatest = latestVersions.get(name);
    if (!version || !versionOnLatest) return [];
    const previousMajor = semver.major(versionOnLatest);
    if (semver.major(version) <= previousMajor) return [];
    return [{ slug, branch: legacyBranch(slug, previousMajor), versionOnLatest }];
  });
}

/** Packages a product's legacy branch keeps: its own and the scaffolder. Throws on an unknown one. */
export function legacyKeptPackages(products: Products, slug: string): string[] {
  const productPackages = products[slug];
  if (!productPackages) {
    throw new Error(`Product "${slug}" is not defined in ${PRODUCTS_PATH}.`);
  }
  return [...productPackages, SCAFFOLDER];
}

/** Repo-relative directories of the workspace packages a legacy branch drops (all the others). */
export function legacyPrunedDirs(
  packages: WorkspacePackage[],
  rootDir: string,
  products: Products,
  slug: string
): string[] {
  const keep = new Set(legacyKeptPackages(products, slug));
  return packages
    .filter((pkg) => !keep.has(pkg.packageJson.name))
    .map((pkg) => repoPath(rootDir, pkg.dir));
}

/**
 * Cuts the legacy branch from `sourceSha` (`release/latest`) with only the product's packages (see
 * header), commits and pushes it. Returns to the commit checked out before.
 */
async function createPrunedLegacyBranch(
  products: Products,
  { slug, branch, versionOnLatest }: LegacyBranch,
  sourceSha: string
): Promise<void> {
  const source = `${RELEASE_LATEST} (${productPackage(slug)}@${versionOnLatest})`;
  console.log(`Creating ${branch} from ${source} at ${sourceSha.slice(0, 7)}`);
  const originalSha = git('rev-parse', 'HEAD');
  git('checkout', '-q', '-f', '--detach', sourceSha);
  try {
    const { packages, rootDir } = await getPackages(process.cwd());
    // committed packages only: `samples/*` workspaces are generated (scaffold-samples), not tracked
    const tracked = new Set(git('ls-files', '--', '*package.json').split('\n'));
    const isCommitted = (pkg: WorkspacePackage) =>
      tracked.has(repoPath(rootDir, path.join(pkg.dir, 'package.json')));
    const pruned = legacyPrunedDirs(packages.filter(isCommitted), rootDir, products, slug);
    if (pruned.length > 0) git('rm', '-r', '-q', '--', ...pruned);
    // Untracked leftovers: build output and per-package node_modules from the publish run, and
    // generated workspaces (samples). Left in place, yarn would write their dependencies into the
    // committed lockfile and `yarn install --immutable` would fail on a fresh clone of the branch.
    const generated = packages
      .filter((pkg) => !isCommitted(pkg))
      .map((pkg) => repoPath(rootDir, pkg.dir));
    const leftovers = [...pruned, ...generated];
    if (leftovers.length > 0) git('clean', '-fdxq', '--', ...leftovers);

    // a legacy release never publishes the scaffolder: changesets ignores it there
    const configPath = path.join(rootDir, CHANGESET_CONFIG_PATH);
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    config.ignore = [...new Set([...(config.ignore ?? []), SCAFFOLDER])];
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

    updateLockfile();
    git('add', '--', CHANGESET_CONFIG_PATH, 'yarn.lock');
    const summary =
      `Kept: ${legacyKeptPackages(products, slug).join(', ')} (${SCAFFOLDER} ignored by ` +
      `changesets). Removed (resolved from npm): ${pruned.join(', ') || 'none'}.`;
    const subject = `[ci] Legacy ${slug} branch from ${source}: product packages only`;
    git('commit', '-q', '-m', subject, '-m', summary);
    git('push', 'origin', `HEAD:refs/heads/${branch}`);
    console.log(`  ${summary}`);
  } finally {
    git('checkout', '-q', '-f', '--detach', originalSha);
  }
}

const DEPENDENCY_TYPES = ['dependencies', 'devDependencies', 'peerDependencies'] as const;

interface PackageLike {
  packageJson: { name: string } & Partial<
    Record<(typeof DEPENDENCY_TYPES)[number], Record<string, string>>
  >;
}

/** Content SDK packages the workspace depends on that aren't workspace packages (sorted). */
export function npmResolvedSdkDeps(packages: PackageLike[]): string[] {
  const workspace = new Set(packages.map((pkg) => pkg.packageJson.name));
  const deps = new Set(
    packages.flatMap((pkg) =>
      DEPENDENCY_TYPES.flatMap((type) => Object.keys(pkg.packageJson[type] ?? {}))
    )
  );
  return [...deps].filter((name) => name.startsWith(SDK_SCOPE) && !workspace.has(name)).sort();
}

/** The newest legacy branch of each product (highest `v<N>`), from legacy branch names. */
export function latestLegacyBranches(branches: string[]): string[] {
  const newest = new Map<string, { branch: string; major: number }>();
  for (const branch of branches) {
    const match = /^release\/legacy\/(.+)\/v(\d+)$/.exec(branch);
    if (!match) continue;
    const [, slug, major] = match;
    if ((newest.get(slug)?.major ?? -1) < Number(major)) {
      newest.set(slug, { branch, major: Number(major) });
    }
  }
  return [...newest.values()].map(({ branch }) => branch).sort();
}

/**
 * Refreshes the lockfile of each product's newest legacy branch: the Content SDK packages it
 * resolves from npm move to their newest in-range releases (as its consumers install them), so the
 * branch builds and tests against them. Commits and pushes `yarn.lock` when it changed (`[skip ci]`:
 * no legacy canary or release run). Works in a temporary worktree; the current checkout is untouched.
 */
export async function refreshLegacyLockfiles(): Promise<void> {
  const heads = git('ls-remote', '--heads', 'origin', 'refs/heads/release/legacy/*')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t')[1].replace('refs/heads/', ''));
  const branches = latestLegacyBranches(heads);
  if (branches.length === 0) {
    console.log('No legacy branches; nothing to refresh.');
    return;
  }

  for (const branch of branches) {
    const dir = path.join(os.tmpdir(), `legacy-refresh-${branch.replace(/\//g, '-')}`);
    git('fetch', 'origin', branch);
    git('worktree', 'add', '-f', '--detach', dir, `origin/${branch}`);
    try {
      const deps = npmResolvedSdkDeps((await getPackages(dir)).packages);
      console.log(`${branch}: refreshing ${deps.join(', ') || 'nothing'}`);
      if (deps.length === 0) continue;
      execFileSync('yarn', ['up', '-R', '--mode=update-lockfile', ...deps], {
        cwd: dir,
        stdio: 'inherit',
        env: { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: 'false' },
        shell: process.platform === 'win32',
      });
      if (!git('-C', dir, 'status', '--porcelain', '--', 'yarn.lock')) {
        console.log(`  ${branch}: yarn.lock already up to date.`);
        continue;
      }
      git('-C', dir, 'add', '--', 'yarn.lock');
      git(
        '-C',
        dir,
        'commit',
        '-q',
        '-m',
        '[ci] Refresh npm-resolved Content SDK packages [skip ci]'
      );
      git('-C', dir, 'push', 'origin', `HEAD:refs/heads/${branch}`);
      console.log(`  ✅ ${branch}: refreshed yarn.lock pushed.`);
    } finally {
      git('worktree', 'remove', '--force', dir);
    }
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
  if (tryGit('fetch', 'origin', RELEASE_LATEST) === null) {
    console.log(`${RELEASE_LATEST} doesn't exist yet (no prior release); no legacy branches.`);
    return;
  }
  const latestRef = `origin/${RELEASE_LATEST}`;
  const latestVersions = await versionsAt(latestRef);

  for (const slug of Object.keys(products)) {
    const name = productPackage(slug);
    const version = published.find((p) => p.name === name)?.version ?? 'not released';
    console.log(
      `  ${name}: ${version} (on ${RELEASE_LATEST}: ${latestVersions.get(name) ?? 'none'})`
    );
  }

  const needed = planLegacyBranches(products, published, latestVersions);
  if (needed.length === 0) {
    console.log('No product major in this release; no legacy branches.');
    return;
  }

  const sourceSha = git('rev-parse', latestRef);
  for (const legacy of needed) {
    if (branchExistsOnRemote(legacy.branch)) {
      console.log(`${legacy.branch} already exists on origin; skipping.`);
      continue;
    }
    await createPrunedLegacyBranch(products, legacy, sourceSha);
    console.log(`✅ Created ${legacy.branch}.`);
  }
}
