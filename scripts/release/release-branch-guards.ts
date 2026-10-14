/**
 * Release branch guards: the checks a release branch runs before anything reaches npm. The
 * branch prefix decides which guards run (`GUARDS`, `guardsFor`); other branches pass.
 *
 * - limited / hotfix (`release/limited/*`, `release/hotfix/*`): **release versions**. These release
 *   types publish to npm `latest` from a side branch and compute versions independently, so a version
 *   about to be published may:
 *   - already be on npm, published from another release branch (e.g. dev released it after the hotfix branch
 *     was cut). `changeset publish` treats it as "already published" and skips it without failing;
 *   - be lower than npm's `latest` (e.g. hotfix 2.4.1 after dev released 2.5.0). Publishing it with
 *     `--tag latest` would move `latest` back.
 *   "About to be published" = publishable packages whose version changed between `BASE_SHA` and the
 *   checked commit (only the release PR changes versions). A version already on npm is allowed when
 *   changesets tagged it on this branch (its `<pkg>@<version>` tag is an ancestor of the checked
 *   commit), e.g. when re-running after a partial publish. Skipped while changesets are pending
 *   (decided as changesets/action does: in pre mode, changesets already versioned don't count):
 *   changesets/action then opens the release PR instead of publishing.
 * - legacy (`release/legacy/*`): **legacy changesets**. A legacy branch holds only its product's
 *   packages plus `create-content-sdk-app`, which changesets ignores there; everything else resolves
 *   from npm (P1). Fails on changesets a legacy branch can't release:
 *   - naming a package that isn't in the workspace (a shared package such as core, typically from a
 *     cherry-pick off dev): changesets rejects it at version time, after the merge. Shared fixes
 *     ship from dev; legacy consumers get them through their caret range;
 *   - naming an ignored package (`create-content-sdk-app`): changesets never consumes it, so it stays
 *     pending and changesets/action silently never switches to publishing on this branch.
 *
 * Runs as a PR check (`pr_release_branch_guards.yml`, on the PR merge commit; mark it required on
 * `release/**`) and in `publish.yml` before changesets/action, as a backstop for a release from
 * another release branch that lands after the PR check passed (failing there leaves the version commit merged
 * but unpublished).
 *
 * Input (env):
 * - GITHUB_BASE_REF (PR) or GITHUB_REF_NAME (push): the release branch
 * - BASE_SHA: PR `github.event.pull_request.base.sha`; push `github.event.before`
 * - GITHUB_SHA: the checked commit (PR merge commit, or the pushed commit)
 *
 * Usage: node ./scripts/release/release-branch-guards.ts [branch]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readConfig } from '@changesets/config';
import { readPreState } from '@changesets/pre';
import { readChangesets } from '@changesets/read';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';
import { runMain, type ChangesetLike } from '../changesets/utils.ts';
import {
  branchPrefix,
  changedVersions,
  git,
  isUnsetSha,
  npmInfo,
  taggedOnThisBranch,
  type NpmInfo,
} from './utils.ts';

/** Guards by branch prefix (`branchPrefix`); other branches have none. */
const GUARDS = new Map<string, Guard[]>([
  ['release/limited', [releaseVersionsGuard]],
  ['release/hotfix', [releaseVersionsGuard]],
  ['release/legacy', [legacyChangesetsGuard]],
]);

type Guard = () => Promise<void>;

// ---------------------------------------------------------------------------------------------
// Release versions (limited / hotfix)
// ---------------------------------------------------------------------------------------------

export interface ReleaseCandidate {
  name: string;
  version: string;
  npm: NpmInfo | null;
  /** The version's `<pkg>@<version>` tag is an ancestor of the checked commit. */
  taggedOnThisBranch: boolean;
}

/** Whether publishing this version is unsafe or fine. */
export function versionProblem({
  name,
  version,
  npm,
  taggedOnThisBranch,
}: ReleaseCandidate): string | null {
  if (!npm) return null; // first publish of the package
  if (npm.versions.includes(version) && !taggedOnThisBranch) {
    return `${name}@${version} is already on npm, published from another release branch; changeset publish would skip it silently.`;
  }
  if (npm.latest && semver.lt(version, npm.latest)) {
    return `${name}@${version} is lower than npm latest ${npm.latest}; publishing it would move latest back.`;
  }
  return null;
}

/** Changesets changesets/action would version (so it opens the release PR instead of publishing). */
export async function pendingChangesets(cwd: string): Promise<string[]> {
  const [changesets, preState] = await Promise.all([readChangesets(cwd), readPreState(cwd)]);
  return changesets
    .map((cs) => cs.id)
    .filter((id) => !preState || preState.mode === 'exit' || !preState.changesets.includes(id));
}

export async function releaseVersionsGuard(): Promise<void> {
  const pending = await pendingChangesets(process.cwd());
  if (pending.length > 0) {
    console.log(
      `${pending.length} pending changeset(s); changesets/action versions instead of publishing. ` +
        'Nothing to check.'
    );
    return;
  }

  const base = process.env.BASE_SHA ?? '';
  const sha = process.env.GITHUB_SHA || git('rev-parse', 'HEAD');
  if (isUnsetSha(base)) {
    console.log('New branch push; no versions changed. Nothing to check.');
    return;
  }

  const candidates: ReleaseCandidate[] = (await changedVersions(base, sha)).map((pkg) => ({
    ...pkg,
    npm: npmInfo(pkg.name),
    taggedOnThisBranch: taggedOnThisBranch(pkg, sha),
  }));
  if (candidates.length === 0) {
    console.log('No package versions changed. Nothing to check.');
    return;
  }

  candidates.forEach((c) =>
    console.log(`  ${c.name}@${c.version} (npm latest: ${c.npm?.latest ?? 'unpublished'})`)
  );
  const problems = candidates.map(versionProblem).filter((p): p is string => p !== null);
  if (problems.length > 0) {
    throw new Error(
      `Unsafe release versions:\n${problems.map((p) => `  - ${p}`).join('\n')}\n` +
        'Another release branch released these packages first. Re-cut the branch from the latest release ' +
        '(hotfix / feature release: re-run Prepare Hotfix / Feature Release) so versions are computed from it.'
    );
  }
  console.log('✅ Release versions are new and not lower than npm latest.');
}

// ---------------------------------------------------------------------------------------------
// Legacy changesets (legacy)
// ---------------------------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------------------------

/** The guards a release branch runs, resolved by its prefix. */
export const guardsFor = (branch: string): Guard[] => GUARDS.get(branchPrefix(branch)) ?? [];

async function main(): Promise<void> {
  const branch = process.argv[2] || process.env.GITHUB_BASE_REF || process.env.GITHUB_REF_NAME;
  if (!branch) throw new Error('Pass a branch or set GITHUB_BASE_REF / GITHUB_REF_NAME.');
  const guards = guardsFor(branch);
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
