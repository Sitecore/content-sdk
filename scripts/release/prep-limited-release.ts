/**
 * Prepares a product-based limited release branch (run by `prep_limited_release.yml`).
 *
 * A limited release ships one product with every package below it. Product-specific packages are
 * defined in `.changeset/products.config.json`; packages in no product (core, cli,
 * `create-content-sdk-app`, ...) are shared and ship with either product. The other products'
 * packages are left out by removing their changesets only (no `ignore`; the branch keeps dev's changesets config). A
 * left-out package keeps its version, so:
 * - nothing may bump it: the release plan (the changesets left after pruning plus their cascade
 *   changesets, assembled by changesets via `getCascadeReleasePlan`) fails when it bumps a
 *   left-out package (e.g. a shared major cascading into the other product). Such changes ship in a
 *   full release from dev;
 * - it must already be on npm: changeset publish publishes every package whose version isn't.
 * Released dependents keep their range to it (e.g. `create-content-sdk-app` to the other product's
 * templates), so npm users get its released version.
 *
 * Usage: tsx ./scripts/release/prep-limited-release.ts <product> [--dry-run]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { unlinkSync } from 'fs';
import path from 'path';
import { readConfig } from '@changesets/config';
import { readPreState } from '@changesets/pre';
import { readChangesets } from '@changesets/read';
import { getPackages } from '@manypkg/get-packages';
import type { ComprehensiveRelease, ReleasePlan } from '@changesets/types';
import { getCascadeReleasePlan } from '../changesets/cascade-version';
import { readProducts, runMain, type ChangesetLike, type Products } from '../changesets/utils';
import { PRODUCTS_PATH } from '../constants';
import { npmInfo } from './utils';

/**
 * Packages left out of a product's limited release: the other products' packages, except those the
 * product lists too.
 */
export function productExclusions(products: Products, product: string): string[] {
  const own = new Set(products[product]);
  const others = Object.entries(products)
    .filter(([name]) => name !== product)
    .flatMap(([, packages]) => packages);
  return [...new Set(others)].filter((name) => !own.has(name));
}

/** Changesets naming an excluded package (removed from the limited release branch). */
export function excludedChangesets<T extends ChangesetLike>(
  changesets: T[],
  excluded: string[]
): T[] {
  return changesets.filter((cs) => cs.releases.some((r) => excluded.includes(r.name)));
}

/** Why the release plan can't ship as a limited release: it bumps a left-out package. */
export function releasePlanProblems(releasePlan: ReleasePlan, excluded: string[]): string[] {
  return releasePlan.releases
    .filter((r) => r.type !== 'none' && excluded.includes(r.name))
    .map(
      (r) =>
        `${r.name} gets a ${r.type} (${r.oldVersion} → ${r.newVersion}), which would publish the ` +
        `other product's unreleased code`
    );
}

/** Releases left once the excluded packages are dropped. */
export function limitedReleases(
  releasePlan: ReleasePlan,
  excluded: string[]
): ComprehensiveRelease[] {
  return releasePlan.releases.filter((r) => r.type !== 'none' && !excluded.includes(r.name));
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
  // a left-out package keeps its version, so it must already be published: changeset publish
  // publishes every package whose version isn't on npm
  const unpublished = excluded
    .map((name) => packages.packages.find((pkg) => pkg.packageJson.name === name)!.packageJson)
    .filter((pkg) => !npmInfo(pkg.name)?.versions.includes(pkg.version))
    .map((pkg) => `${pkg.name}@${pkg.version}`);
  if (unpublished.length > 0) {
    throw new Error(
      `Left-out packages aren't on npm yet, so the ${product} release would publish them: ` +
        `${unpublished.join(', ')}. Release them in a full release from dev first.`
    );
  }

  const changesets = await readChangesets(cwd);
  const removed = excludedChangesets(changesets, excluded);
  const released = changesets.filter((cs) => !removed.includes(cs));

  // what the version step on the branch computes for the released changesets
  const { config } = await readConfig(cwd, packages);
  const releasePlan = getCascadeReleasePlan(released, packages, config, await readPreState(cwd));

  const problems = releasePlanProblems(releasePlan, excluded);
  if (problems.length > 0) {
    throw new Error(
      `The ${product} release can't leave the other product out:\n` +
        `${problems.map((p) => `  - ${p}`).join('\n')}\n` +
        `Release these changes in a full release from dev instead. Pending changesets:\n` +
        listChangesets(released)
    );
  }

  const releases = limitedReleases(releasePlan, excluded);
  if (releases.length === 0) {
    throw new Error(`No pending changesets for the ${product} release; nothing to release.`);
  }

  console.log(`🎯 ${product} limited release.`);
  console.log(`   Left out (kept at their released version): ${excluded.join(', ') || 'none'}`);
  console.log(`📋 Release plan:\n${listReleases(releases)}`);
  console.log(
    `🧹 Removing ${removed.length} of ${changesets.length} changeset(s) for left-out packages:`
  );
  if (removed.length > 0) console.log(listChangesets(removed));
  if (dryRun) {
    console.log('\n🔍 DRY RUN: nothing written.');
    return;
  }

  removed.forEach((cs) => unlinkSync(path.join(cwd, '.changeset', `${cs.id}.md`)));
  console.log(`\n✅ Removed ${removed.length} changeset(s).`);
}

runMain(import.meta.url, main);
