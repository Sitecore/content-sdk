/**
 * Enforces one package per changeset file.
 *
 * Reads the pending changesets in `.changeset/` (only the given files, when any are passed). Any
 * changeset that releases more than one package is rewritten into N single-package changesets (one new
 * file per released package, `<original id>-<unscoped package name>.md`, each keeping the original
 * summary and its own bump type), and the original multi-package file is removed. Changesets that already
 * target a single package are left untouched.
 *
 * Modes:
 *   (default)    split multi-package changesets in place
 *   --dry-run    report what would change; write nothing
 *   --check      exit non-zero if any multi-package changeset exists; write nothing
 *                (used by the PR check, which only reports it)
 *
 * Usage: tsx ./scripts/changesets/split-changesets.ts [--dry-run | --check] [.changeset/<id>.md ...]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { renameSync, unlinkSync } from 'fs';
import path from 'path';
import { readChangesets } from '@changesets/read';
import { writeChangeset } from '@changesets/write';
import { readConfig } from '@changesets/config';
import { getPackages } from '@manypkg/get-packages';
import { runMain, type ChangesetLike as BaseChangesetLike } from './utils';

/** Minimal shape of a parsed changeset needed to detect and split multi-package entries. */
export interface ChangesetLike extends BaseChangesetLike {
  summary: string;
}

/** Splits one multi-package changeset into N single-package changeset inputs, keeping the summary. */
export function splitChangeset(
  changeset: ChangesetLike
): { summary: string; releases: [ChangesetLike['releases'][number]] }[] {
  return changeset.releases.map((release) => ({ summary: changeset.summary, releases: [release] }));
}

/** Id of the split changeset for one package: `<original id>-<package name without its scope>`. */
export function splitChangesetId(id: string, packageName: string): string {
  return `${id}-${packageName.replace(/^@[^/]+\//, '')}`;
}

/** Keeps the changesets whose files are listed; all of them when no files are given. */
export function selectChangesets<T extends ChangesetLike>(changesets: T[], files: string[]): T[] {
  if (files.length === 0) return changesets;
  const ids = files.map((file) => path.basename(file, '.md'));
  return changesets.filter((cs) => ids.includes(cs.id));
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const checkOnly = process.argv.includes('--check');
  const files = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  const cwd = process.cwd();

  console.log(
    ` Split changesets: start${checkOnly ? ' (check only)' : dryRun ? ' (dry run)' : ''}...`
  );

  const packages = await getPackages(cwd);
  const { config, errors } = await readConfig(cwd, packages);
  if (!config) {
    throw new Error(`Invalid .changeset/config.json:\n${errors.join('\n')}`);
  }

  const changesets = selectChangesets((await readChangesets(cwd)) as ChangesetLike[], files);
  if (changesets.length === 0) {
    console.log('No pending changesets found.');
    return;
  }

  const multiPackage = changesets.filter((cs) => cs.releases.length > 1);
  if (multiPackage.length === 0) {
    console.log('✅ All changesets target a single package.');
    return;
  }

  if (checkOnly) {
    console.error(
      `\n ${multiPackage.length} changeset(s) release more than one package. ` +
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
    console.log(`\n ${changeset.id}.md → ${changeset.releases.length} single-package changesets:`);

    for (const single of splitChangeset(changeset)) {
      const [release] = single.releases;
      console.log(`   - ${release.name} (${release.type})`);
      if (dryRun) {
        createdCount += 1;
        continue;
      }
      const newId = splitChangesetId(changeset.id, release.name);
      const written = await writeChangeset(single, cwd, { format: config.format });
      renameSync(
        path.join(cwd, '.changeset', `${written}.md`),
        path.join(cwd, '.changeset', `${newId}.md`)
      );
      createdCount += 1;
      console.log(`     created .changeset/${newId}.md`);
    }

    if (!dryRun) {
      unlinkSync(path.join(cwd, '.changeset', `${changeset.id}.md`));
      console.log(`   removed original .changeset/${changeset.id}.md`);
    }
  }

  console.log(
    `\n${dryRun ? '[dry-run] Would create' : 'Created'} ${createdCount} single-package ` +
      `changeset(s) from ${multiPackage.length} multi-package file(s).`
  );
}

runMain(import.meta.url, main);
