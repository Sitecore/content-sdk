/**
 * PR check for legacy lines (`release/legacy/*`, `pr_legacy_changesets_guard.yml`).
 *
 * A legacy branch holds only its product's packages plus `create-content-sdk-app`, which changesets
 * ignores there (`create-legacy-branches.ts`); everything else resolves from npm (P1). Fails on
 * changesets the legacy line can't release:
 * - naming a package that isn't in the workspace (a shared package such as core, typically from a
 *   cherry-pick off dev): changesets rejects it at version time, after the merge. Shared fixes ship
 *   from dev; legacy consumers get them through their caret range. Drop the changeset from the PR;
 * - naming an ignored package (`create-content-sdk-app`): changesets never consumes it, so it stays
 *   pending and changesets/action silently never switches to publishing on this branch.
 *
 * Usage: tsx ./scripts/release/guards/legacy-changesets-guard.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { appendFileSync } from 'fs';
import { readConfig } from '@changesets/config';
import { readChangesets } from '@changesets/read';
import { getPackages } from '@manypkg/get-packages';
import { runMain, type ChangesetLike } from '../../changesets/utils';

/** Why each changeset can't be released from this legacy branch; empty when all can. */
export function unreleasableChangesets(
  changesets: ChangesetLike[],
  workspace: Set<string>,
  ignore: string[]
): string[] {
  return changesets.flatMap((cs) =>
    cs.releases.flatMap(({ name }) => {
      if (!workspace.has(name)) {
        return [
          `.changeset/${cs.id}.md names ${name}, which is not on this legacy branch (it resolves ` +
            'from npm). Ship the fix from dev; legacy consumers get it through their range.',
        ];
      }
      if (ignore.includes(name)) {
        return [
          `.changeset/${cs.id}.md names ${name}, which a legacy line never publishes; the ` +
            'changeset would stay pending and block publishing.',
        ];
      }
      return [];
    })
  );
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const packages = await getPackages(cwd);
  const { config, errors } = await readConfig(cwd, packages);
  if (errors) throw new Error(`Invalid changesets config:\n${errors.join('\n')}`);

  const changesets = await readChangesets(cwd);
  const workspace = new Set(packages.packages.map((p) => p.packageJson.name));
  const problems = unreleasableChangesets(changesets, workspace, config.ignore);
  if (problems.length === 0) {
    console.log(
      `✅ All ${changesets.length} pending changeset(s) can be released from this branch.`
    );
    return;
  }

  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary) {
    appendFileSync(
      summary,
      [
        '## ❌ Changesets this legacy line can’t release',
        '',
        ...problems.map((p) => `- ${p}`),
        '',
      ].join('\n')
    );
  }
  throw new Error(
    `Changesets this legacy line can't release:\n${problems.map((p) => `  - ${p}`).join('\n')}`
  );
}

runMain(import.meta.url, main);
