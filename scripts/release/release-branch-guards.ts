/**
 * Release branch guards: the checks a release branch runs before anything reaches npm. The mode
 * and the branch prefix decide which guards run (`GUARDS`); other branches pass.
 * - `pr`: early detection on PRs, from the pending changesets (what the release would publish).
 * - `publish`: right before `changeset publish` on branches publishing to npm `latest`: the
 *   versions to publish must not move `latest` back (npm can move after the PR checks ran).
 *
 * Input (env): GITHUB_BASE_REF (PR) or GITHUB_REF_NAME (push): the release branch.
 *
 * Usage: node ./scripts/release/release-branch-guards.ts <pr|publish> [branch]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readConfig } from '@changesets/config';
import { readChangesets } from '@changesets/read';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';
import { getReleasePlan } from '../changesets/cascade-version.ts';
import { runMain, type ChangesetLike } from '../changesets/utils.ts';
import { MAIN_BRANCH, RELEASE_LATEST } from '../constants.ts';
import { branchPrefix, npmView } from './utils.ts';

type Guard = () => Promise<void>;
type Mode = 'pr' | 'publish';

/** Guards by mode, then branch prefix (`branchPrefix`); other branches have none. */
const GUARDS: Record<Mode, Map<string, Guard[]>> = {
  pr: new Map([
    [RELEASE_LATEST, [releaseVersionsGuard]],
    ['release/legacy', [legacyChangesetsGuard]],
  ]),
  publish: new Map([
    [MAIN_BRANCH, [publishVersionsGuard]],
    [RELEASE_LATEST, [publishVersionsGuard]],
  ]),
};

export async function releaseVersionsGuard(): Promise<void> {
  const releases = (await getReleasePlan()).releases.filter((r) => r.type !== 'none');
  if (releases.length === 0) {
    console.log('No pending changesets. Nothing to check.');
    return;
  }

  const problems = releases.flatMap(({ name, newVersion }) => {
    const latest = npmView(name, 'dist-tags.latest');
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

/**
 * Fails when `changeset publish --tag latest` would move npm `latest` back: a public workspace
 * package whose version is below `latest` and not on npm yet. Versions on npm already (`latest`
 * itself, an older release) are skipped by `changeset publish`, as on a re-run.
 */
export async function publishVersionsGuard(): Promise<void> {
  const { packages } = await getPackages(process.cwd());
  const problems = packages
    .filter(({ packageJson }) => !packageJson.private)
    .flatMap(({ packageJson: { name, version } }) => {
      const latest = npmView(name, 'dist-tags.latest');
      if (!latest || !semver.lt(version, latest) || npmView(`${name}@${version}`, 'version')) {
        return [];
      }
      return `${name}@${version} is below npm latest (${latest}) and not published yet`;
    });
  if (problems.length > 0) {
    throw new Error(
      `Publishing would move npm latest back:\n${problems.map((p) => `  - ${p}`).join('\n')}\n` +
        'npm latest moved after this release was versioned. Redo this release on top of ' +
        `${RELEASE_LATEST} as the newer release left it.`
    );
  }
  console.log(`✅ No version to publish is below npm latest (${packages.length} packages).`);
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
  const [mode, branchArg] = process.argv.slice(2);
  if (mode !== 'pr' && mode !== 'publish') {
    throw new Error(
      `Unknown mode "${mode ?? ''}". Usage: release-branch-guards.ts <pr|publish> [branch]`
    );
  }
  const branch = branchArg || process.env.GITHUB_BASE_REF || process.env.GITHUB_REF_NAME;
  if (!branch) throw new Error('Pass a branch or set GITHUB_BASE_REF / GITHUB_REF_NAME.');
  const guards = GUARDS[mode].get(branchPrefix(branch)) || [];
  if (guards.length === 0) {
    console.log(`${branch}: no ${mode} guards for ${branchPrefix(branch)}.`);
    return;
  }
  for (const guard of guards) {
    console.log(`\n▶ ${mode}: ${guard.name} (${branch})`);
    await guard();
  }
}

runMain(import.meta.url, main);
