/**
 * Prepares a product-based limited release branch (run by `prep_limited_release.yml`).
 *
 * A limited release ships one product with every package below it. Product-specific packages are
 * defined in `.changeset/products.config.json`; a package listed under several products (e.g.
 * `create-content-sdk-app`) belongs to each of them. The other products' packages are left out of
 * the release in one of two ways:
 * - ignored (`.changeset/config.json` `ignore`, validated by changesets): the packages nothing
 *   released depends on at runtime, e.g. `angular` in a nextjs release;
 * - held back: the ones a released package depends on at runtime, which changesets refuses to
 *   ignore. E.g. `create-content-sdk-app` depends on both `*-templates` packages, so in a nextjs
 *   release `angular-templates` can't be ignored without ignoring `create-content-sdk-app`, whose
 *   range would then go stale on a product major (P24). A held-back package keeps its version: its
 *   changesets are removed, the release fails if anything would bump it, and it must already be on
 *   npm (changeset publish publishes every non-ignored package whose version isn't). Released
 *   dependents keep their range to it, so npm users get its released version.
 *
 * Usage: tsx ./scripts/release/prep-limited-release.ts <product> [--dry-run]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { validateConfig } from '@changesets/config';
import { getDependentsGraph } from '@changesets/get-dependents-graph';
import { readPreState } from '@changesets/pre';
import { readChangesets } from '@changesets/read';
import { getPackages, type Packages } from '@manypkg/get-packages';
import type { ComprehensiveRelease, ReleasePlan } from '@changesets/types';
import { getCascadeReleasePlan } from '../changesets/cascade-version';
import {
  PRODUCTS_PATH,
  readProducts,
  runMain,
  type ChangesetLike,
  type Products,
} from '../changesets/utils';
import { npmInfo } from './release-state';

const CHANGESET_CONFIG_PATH = '.changeset/config.json';

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

/**
 * Splits the excluded packages into those changesets can ignore and those it can't (held back): a
 * package a released package depends on at runtime (dependencies, peer, optional; the same graph
 * changesets' config validation uses) can't be ignored.
 */
export function splitExclusions(
  excluded: string[],
  packages: Packages,
  options: { bumpVersionsWithWorkspaceProtocolOnly?: boolean } = {}
): { ignore: string[]; heldBack: string[] } {
  const dependents = getDependentsGraph(packages, {
    ignoreDevDependencies: true,
    bumpVersionsWithWorkspaceProtocolOnly: options.bumpVersionsWithWorkspaceProtocolOnly,
  });
  const heldBack = excluded.filter((name) =>
    (dependents.get(name) ?? []).some((dependent) => !excluded.includes(dependent))
  );
  return { ignore: excluded.filter((name) => !heldBack.includes(name)), heldBack };
}

/** Changesets naming an excluded package (removed from the limited release branch). */
export function excludedChangesets<T extends ChangesetLike>(
  changesets: T[],
  excluded: string[]
): T[] {
  return changesets.filter((cs) => cs.releases.some((r) => excluded.includes(r.name)));
}

/** Why the release plan (assembled without the ignore list) can't ship as a limited release. */
export function releasePlanProblems(
  releasePlan: ReleasePlan,
  ignore: string[],
  heldBack: string[]
): string[] {
  return releasePlan.releases.flatMap((r) => {
    if (r.type === 'major' && ignore.includes(r.name)) {
      return [
        `${r.name} gets a major (${r.oldVersion} → ${r.newVersion}), which the ignore list would drop`,
      ];
    }
    if (r.type !== 'none' && heldBack.includes(r.name)) {
      return [
        `${r.name} gets a ${r.type} (${r.oldVersion} → ${r.newVersion}), which would publish the ` +
          `other product's unreleased code`,
      ];
    }
    return [];
  });
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

  const configPath = path.join(cwd, CHANGESET_CONFIG_PATH);
  const writtenConfig = JSON.parse(readFileSync(configPath, 'utf8'));
  const excluded = productExclusions(products, product);
  const { ignore, heldBack } = splitExclusions(excluded, packages, writtenConfig);
  writtenConfig.ignore = ignore;
  const parsed = validateConfig(writtenConfig, packages);
  if (parsed.errors) {
    throw new Error(`Invalid ignore list for ${product}:\n${parsed.errors.join('\n')}`);
  }

  // a held-back package keeps its version, so it must already be published: changeset publish
  // publishes every non-ignored package whose version isn't on npm
  const unpublished = heldBack
    .map((name) => packages.packages.find((pkg) => pkg.packageJson.name === name)!.packageJson)
    .filter((pkg) => !npmInfo(pkg.name)?.versions.includes(pkg.version))
    .map((pkg) => `${pkg.name}@${pkg.version}`);
  if (unpublished.length > 0) {
    throw new Error(
      `Held-back packages aren't on npm yet, so the ${product} release would publish them: ` +
        `${unpublished.join(', ')}. Release them in a full release from dev first.`
    );
  }

  const changesets = await readChangesets(cwd);
  const removed = excludedChangesets(changesets, excluded);
  const released = changesets.filter((cs) => !removed.includes(cs));

  // what the version step computes for the released changesets, before `ignore` drops the bumps of
  // the ignored packages
  const releasePlan = getCascadeReleasePlan(
    released,
    packages,
    { ...parsed.config, ignore: [] },
    await readPreState(cwd)
  );

  const problems = releasePlanProblems(releasePlan, ignore, heldBack);
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
  console.log(`   Ignored: ${ignore.join(', ') || 'none'}`);
  console.log(`   Held back (kept at their released version): ${heldBack.join(', ') || 'none'}`);
  console.log(`📋 Release plan:\n${listReleases(releases)}`);
  console.log(
    `🧹 Removing ${removed.length} of ${changesets.length} changeset(s) for left-out packages:`
  );
  if (removed.length > 0) console.log(listChangesets(removed));
  if (dryRun) {
    console.log('\n🔍 DRY RUN: nothing written.');
    return;
  }

  writeFileSync(configPath, `${JSON.stringify(writtenConfig, null, 2)}\n`, 'utf8');
  removed.forEach((cs) => unlinkSync(path.join(cwd, '.changeset', `${cs.id}.md`)));
  console.log(`\n✅ Updated ${CONFIG_PATH} and removed ${removed.length} changeset(s).`);
}

runMain(import.meta.url, main);
