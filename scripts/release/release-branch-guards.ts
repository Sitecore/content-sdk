/**
 * Release branch guards: the checks a release branch runs before anything reaches npm. The
 * branch prefix decides which guards run (`GUARDS`, `guardsFor`); other branches pass.
 *
 * Input (env): GITHUB_BASE_REF (PR) or GITHUB_REF_NAME (push): the release branch.
 *
 * Usage: node ./scripts/release/release-branch-guards.ts [branch]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readConfig } from '@changesets/config';
import { readChangesets } from '@changesets/read';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';
import { getReleasePlan } from '../changesets/cascade-version.ts';
import { runMain, type ChangesetLike } from '../changesets/utils.ts';
import { RELEASE_LATEST } from '../constants.ts';
import { branchPrefix, npmLatest } from './utils.ts';

type Guard = () => Promise<void>;

/** Guards by branch prefix (`branchPrefix`); other branches have none. */
const GUARDS = new Map<string, Guard[]>([
  [RELEASE_LATEST, [releaseVersionsGuard]],
  ['release/legacy', [legacyChangesetsGuard]],
]);

export async function releaseVersionsGuard(): Promise<void> {
  const releases = (await getReleasePlan()).releases.filter((r) => r.type !== 'none');
  if (releases.length === 0) {
    console.log('No pending changesets. Nothing to check.');
    return;
  }

  const problems = releases.flatMap(({ name, newVersion }) => {
    const latest = npmLatest(name);
    if (!latest || semver.gt(newVersion, latest)) {
      return [];
    }
    return `Planned ${name}@${newVersion} version bump is lower or equal to latest published NPM package`;
  });
  if (problems.length > 0) {
    throw new Error(
      `Unsafe release versions:\n${problems.map((p) => `  - ${p}`).join('\n')}\n` +
        `dev released these packages first. Redo this release on top of ${RELEASE_LATEST} as the ` +
        'dev release left it, so versions are computed from it.'
    );
  }
  console.log('✅ Planned release versions are above npm latest.');
}

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
          `.changeset/${cs.id}.md names ${name}, which a legacy release never publishes; the ` +
            'changeset would stay pending and block publishing.',
        ];
      }
      return [];
    })
  );
}

export async function legacyChangesetsGuard(): Promise<void> {
  const cwd = process.cwd();
  const packages = await getPackages(cwd);
  const { config, errors } = await readConfig(cwd, packages);
  if (errors) throw new Error(`Invalid changesets config:\n${errors.join('\n')}`);

  const changesets = await readChangesets(cwd);
  const workspace = new Set(packages.packages.map((p) => p.packageJson.name));
  const problems = unreleasableChangesets(changesets, workspace, config.ignore);
  if (problems.length > 0) {
    throw new Error(
      `Changesets this legacy branch can't release:\n${problems.map((p) => `  - ${p}`).join('\n')}`
    );
  }
  console.log(`✅ All ${changesets.length} pending changeset(s) can be released from this branch.`);
}

async function main(): Promise<void> {
  const branch = process.argv[2] || process.env.GITHUB_BASE_REF || process.env.GITHUB_REF_NAME;
  if (!branch) throw new Error('Pass a branch or set GITHUB_BASE_REF / GITHUB_REF_NAME.');
  const guards = GUARDS.get(branchPrefix(branch)) || [];
  if (guards.length === 0) {
    console.log(`${branch}: no release branch guards for ${branchPrefix(branch)}.`);
    return;
  }
  for (const guard of guards) {
    console.log(`\n▶ ${guard.name} (${branch})`);
    await guard();
  }
}

runMain(import.meta.url, main);
