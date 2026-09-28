/**
 * Enforces one package per changeset file.
 *
 * Reads every pending changeset in `.changeset/`. Any changeset that releases
 * more than one package is rewritten into N single-package changesets (one new
 * file per released package, each keeping the original summary and its own bump
 * type), and the original multi-package file is removed. Changesets that already
 * target a single package are left untouched.
 *
 * Modes:
 *   (default)    split multi-package changesets in place
 *   --dry-run    report what would change; write nothing
 *   --check      exit non-zero if any multi-package changeset exists; write nothing
 *                (used by the PR guard so aggregated changesets can't be merged)
 *
 * Usage: tsx ./scripts/changesets/split-changesets.ts [--dry-run | --check]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { realpathSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { readChangesets } from '@changesets/read';
import { writeChangeset } from '@changesets/write';
import { readConfig } from '@changesets/config';
import { getPackages } from '@manypkg/get-packages';

/** Minimal shape of a parsed changeset needed to detect and split multi-package entries. */
export interface ChangesetLike {
  id: string;
  summary: string;
  releases: { name: string; type: string }[];
}

/** Changesets that release more than one package (i.e. violate one-package-per-file). */
export function findMultiPackageChangesets<T extends { releases: unknown[] }>(changesets: T[]): T[] {
  return changesets.filter((cs) => cs.releases.length > 1);
}

/** Splits one multi-package changeset into N single-package changeset inputs, keeping the summary. */
export function splitChangeset(
  changeset: ChangesetLike
): { summary: string; releases: [ChangesetLike['releases'][number]] }[] {
  return changeset.releases.map((release) => ({ summary: changeset.summary, releases: [release] }));
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const checkOnly = process.argv.includes('--check');
  const cwd = process.cwd();

  console.log(`📦 Split changesets: start${checkOnly ? ' (check only)' : dryRun ? ' (dry run)' : ''}...`);

  const packages = await getPackages(cwd);
  const config = await readConfig(cwd, packages);

  const changesets = await readChangesets(cwd);
  if (changesets.length === 0) {
    console.log('No pending changesets found.');
    return;
  }

  const multiPackage = findMultiPackageChangesets(changesets);
  if (multiPackage.length === 0) {
    console.log('✅ All changesets target a single package.');
    return;
  }

  if (checkOnly) {
    console.error(
      `\n❌ ${multiPackage.length} changeset(s) release more than one package. ` +
        `Each changeset must target exactly one package.\n`
    );
    for (const cs of multiPackage) {
      console.error(`   .changeset/${cs.id}.md → ${cs.releases.map((r) => r.name).join(', ')}`);
    }
    console.error('\nRun `yarn csdk:split-changesets` and commit the result.');
    process.exit(1);
  }

  let createdCount = 0;
  for (const changeset of multiPackage) {
    console.log(`\n✂️  ${changeset.id}.md → ${changeset.releases.length} single-package changesets:`);

    for (const single of splitChangeset(changeset)) {
      const [release] = single.releases;
      console.log(`   - ${release.name} (${release.type})`);
      if (dryRun) {
        createdCount += 1;
        continue;
      }
      const newId = await writeChangeset(single, cwd, { format: config.format });
      createdCount += 1;
      console.log(`     created .changeset/${newId}.md`);
    }

    if (!dryRun) {
      unlinkSync(path.join(cwd, '.changeset', `${changeset.id}.md`));
      console.log(`   removed original .changeset/${changeset.id}.md`);
    }
  }

  console.log(
    `\n${dryRun ? '🔍 [dry-run] Would create' : '✅ Created'} ${createdCount} single-package ` +
      `changeset(s) from ${multiPackage.length} multi-package file(s).`
  );
}

function isMainModule(): boolean {
  try {
    return !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMainModule()) {
  main().catch((error: unknown) => {
    const err = error as Error;
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  });
}
