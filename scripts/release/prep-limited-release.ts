/**
 * Prepares a product-based limited release on `release/latest` (run by `prep_limited_release.yml`
 * on a dev checkout).
 *
 * A limited release ships one product with every package below it. Product-specific packages are
 * defined in `.changeset/products.config.json`; packages in no product (core, cli,
 * `create-content-sdk-app`, ...) are shared and ship with either product.
 *
 * Usage: tsx ./scripts/release/prep-limited-release.ts <product> [--dry-run]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readConfig } from '@changesets/config';
import { readPreState } from '@changesets/pre';
import { readChangesets } from '@changesets/read';
import { getPackages } from '@manypkg/get-packages';
import type { ComprehensiveRelease } from '@changesets/types';
import { getCascadeReleasePlan } from '../changesets/cascade-version';
import { readProducts, runMain, type ChangesetLike } from '../changesets/utils';
import { PRODUCTS_PATH, RELEASE_LATEST } from '../constants';
import { git, packageDirs, tryGit, updateLockfile } from './utils';

/**
 * Packages left out of a product's limited release: the other products' packages, except those the
 * product lists too.
 */
export function productExclusions(products: Record<string, string[]>, product: string): string[] {
  const own = new Set(products[product]);
  const others = Object.entries(products)
    .filter(([name]) => name !== product)
    .flatMap(([, packages]) => packages);
  return [...new Set(others)].filter((name) => !own.has(name));
}

const listChangesets = (changesets: ChangesetLike[]) =>
  changesets
    .map(
      (cs) =>
        `  .changeset/${cs.id}.md (${cs.releases.map((r) => `${r.name} ${r.type}`).join(', ')})`
    )
    .join('\n');

const listReleases = (releases: ComprehensiveRelease[]) =>
  releases.map((r) => `  ${r.name}: ${r.oldVersion} → ${r.newVersion} (${r.type})`).join('\n');

/**
 * Copies the limited release from `devSha` onto `release/latest` (see header, steps 2-3): the
 * package directories and changeset files, in a merge commit with dev as its second parent.
 */
function copyOntoLatest(devSha: string, paths: string[], subject: string, body: string): void {
  if (tryGit('fetch', 'origin', RELEASE_LATEST) === null) {
    throw new Error(
      `${RELEASE_LATEST} does not exist yet. Create it once from the last dev release commit, ` +
        `e.g. git push origin <sha>:refs/heads/${RELEASE_LATEST}.`
    );
  }
  git('checkout', '-q', '-B', RELEASE_LATEST, `origin/${RELEASE_LATEST}`);
  // --no-ff: when release/latest is behind dev (right after a full release), a fast-forward would
  // take all of dev
  git('merge', '-q', '--no-ff', '--no-commit', '-s', 'ours', devSha);
  git('restore', `--source=${devSha}`, '--staged', '--worktree', '--', ...paths);
  updateLockfile();
  git('add', '--', 'yarn.lock');
  git('commit', '-q', '-m', subject, '-m', body);
  git('push', 'origin', `HEAD:refs/heads/${RELEASE_LATEST}`);
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const product = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');

  const products = readProducts(cwd);
  if (!products[product]) {
    throw new Error(
      `Unknown product "${product ?? ''}". ${PRODUCTS_PATH} defines: ${Object.keys(products).join(
        ', '
      )}.`
    );
  }

  const packages = await getPackages(cwd);
  const workspace = new Set(packages.packages.map((pkg) => pkg.packageJson.name));
  const unknown = Object.values(products)
    .flat()
    .filter((name) => !workspace.has(name));
  if (unknown.length > 0) {
    throw new Error(`${PRODUCTS_PATH} lists packages not in the workspace: ${unknown.join(', ')}`);
  }

  const excluded = productExclusions(products, product);
  const changesets = await readChangesets(cwd);
  const released = changesets.filter((cs) => cs.releases.some((r) => !excluded.includes(r.name)));

  // what the version step on release/latest computes for the copied changesets
  const { config, errors } = await readConfig(cwd, packages);
  if (errors) throw new Error(`Invalid changesets config:\n${errors.join('\n')}`);
  const releasePlan = getCascadeReleasePlan(released, packages, config, await readPreState(cwd));

  const releases = releasePlan.releases.filter((r) => r.type !== 'none');
  // e.g. a shared major cascading into the other product (see header)
  const problems = releases.filter((r) => excluded.includes(r.name));
  if (problems.length > 0) {
    throw new Error(
      `The ${product} release can't leave the other product out:\n${listReleases(problems)}\n` +
        "The other product's packages stay at their released version; release these changes in a " +
        `full release from dev instead. Pending changesets:\n${listChangesets(released)}`
    );
  }
  if (releases.length === 0) {
    throw new Error(`No pending changesets for the ${product} release; nothing to release.`);
  }

  const dirs = packageDirs(
    packages.packages,
    packages.rootDir,
    releases.map((r) => r.name)
  );
  const files = released.map((cs) => `.changeset/${cs.id}.md`);

  console.log(`🎯 ${product} limited release onto ${RELEASE_LATEST}.`);
  console.log(`   Left out (kept at their released version): ${excluded.join(', ') || 'none'}`);
  console.log(`📦 Copying from dev:\n${[...dirs, ...files].map((p) => `  ${p}`).join('\n')}`);
  if (dryRun) {
    console.log('\n🔍 DRY RUN: nothing written.');
    return;
  }

  const devSha = git('rev-parse', 'HEAD');
  copyOntoLatest(
    devSha,
    [...dirs, ...files],
    `[ci] Limited release: ${product}`,
    `From dev ${devSha.slice(0, 7)}:\n${listReleases(releases)}`
  );
  console.log(`\n✅ Pushed the ${product} limited release to ${RELEASE_LATEST}.`);
}

runMain(import.meta.url, main);
