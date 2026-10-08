/**
 * Prepares a product-based limited release branch (run by `limited_release_prep.yml`).
 *
 * A limited release ships one product with every package below it. Product-specific packages are
 * defined in `.changeset/products.json`; the other products' packages sit at the top of the
 * dependency chain (nothing released depends on them), so they go into `.changeset/config.json`
 * `ignore`, which changesets validates natively. Packages that need a release on their own go
 * through the hotfix flow.
 *
 * Steps, on the release branch (this commit is never cherry-picked back to dev):
 * 1. write the other products' packages to `.changeset/config.json` `ignore` and validate it;
 * 2. refuse a propagating major bump outside the product's own packages: a major in a shared package
 *    with dependents (e.g. core) cascades to them, including the ignored product, whose range would
 *    go stale on dev and whose cascade bump would be lost. It must ship in a full release from dev;
 * 3. delete the ignored packages' changesets: changesets/action only publishes once no changeset
 *    files remain. They stay on dev.
 *
 * Usage: tsx ./scripts/changesets/prep-limited-release.ts <product> [--dry-run]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { validateConfig } from '@changesets/config';
import { getDependentsGraph } from '@changesets/get-dependents-graph';
import { readChangesets } from '@changesets/read';
import { getPackages } from '@manypkg/get-packages';
import { isMainModule } from './utils';

const CONFIG_PATH = '.changeset/config.json';
export const PRODUCTS_PATH = '.changeset/products.json';

/** Product name -> its product-specific packages. */
export type Products = Record<string, string[]>;

interface ChangesetLike {
  id: string;
  releases: { name: string; type: string }[];
}

export function readProducts(cwd: string): Products {
  return JSON.parse(readFileSync(path.join(cwd, PRODUCTS_PATH), 'utf8'));
}

/** Packages ignored by a product's limited release: every other product's packages. */
export function productIgnore(products: Products, product: string): string[] {
  return Object.entries(products)
    .filter(([name]) => name !== product)
    .flatMap(([, packages]) => packages);
}

/**
 * Changesets with a major bump that would propagate (the package has dependents) for a package that
 * is not one of the product's own packages.
 */
export function propagatingMajors(
  changesets: ChangesetLike[],
  productPackages: string[],
  dependents: Map<string, string[]>
): ChangesetLike[] {
  return changesets.filter((cs) =>
    cs.releases.some(
      (r) =>
        r.type === 'major' &&
        !productPackages.includes(r.name) &&
        (dependents.get(r.name)?.length ?? 0) > 0
    )
  );
}

/** Changesets naming an ignored package (removed from the limited release branch). */
export function ignoredChangesets(changesets: ChangesetLike[], ignore: string[]): ChangesetLike[] {
  return changesets.filter((cs) => cs.releases.some((r) => ignore.includes(r.name)));
}

const listChangesets = (changesets: ChangesetLike[]) =>
  changesets
    .map((cs) => `  .changeset/${cs.id}.md (${cs.releases.map((r) => `${r.name} ${r.type}`).join(', ')})`)
    .join('\n');

async function main(): Promise<void> {
  const cwd = process.cwd();
  const product = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');

  const products = readProducts(cwd);
  if (!products[product]) {
    throw new Error(
      `Unknown product "${product ?? ''}". ${PRODUCTS_PATH} defines: ${Object.keys(products).join(', ')}.`
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

  const ignore = productIgnore(products, product);
  const configPath = path.join(cwd, CONFIG_PATH);
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  config.ignore = ignore;
  const { errors } = validateConfig(config, packages);
  if (errors) throw new Error(`Invalid ignore list for ${product}:\n${errors.join('\n')}`);

  const changesets = await readChangesets(cwd);
  const removed = ignoredChangesets(changesets, ignore);
  const released = changesets.filter((cs) => !removed.includes(cs));

  const majors = propagatingMajors(released, products[product], getDependentsGraph(packages));
  if (majors.length > 0) {
    throw new Error(
      `Propagating major bumps outside the ${product} packages (${products[product].join(', ')}). ` +
        `They cascade to every dependent, including ignored ones, so release them in a full ` +
        `release from dev instead:\n${listChangesets(majors)}`
    );
  }
  if (released.length === 0) {
    throw new Error(`No pending changesets for the ${product} release; nothing to release.`);
  }

  console.log(`🎯 ${product} limited release. Ignored: ${ignore.join(', ')}`);
  console.log(`🧹 Removing ${removed.length} of ${changesets.length} changeset(s) for ignored packages:`);
  if (removed.length > 0) console.log(listChangesets(removed));
  if (dryRun) {
    console.log('\n🔍 DRY RUN: nothing written.');
    return;
  }

  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  removed.forEach((cs) => unlinkSync(path.join(cwd, '.changeset', `${cs.id}.md`)));
  console.log(`\n✅ Updated ${CONFIG_PATH} and removed ${removed.length} changeset(s).`);
}

if (isMainModule(import.meta.url)) {
  main().catch((error: unknown) => {
    const err = error as Error;
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}
