/**
 * Guardrail for release lines that publish to npm `latest` from a side branch (`release/limited/*`,
 * `release/hotfix/*`). Runs:
 * - as a PR check on the release PR (`pr_release_versions_guard.yml`), so an unsafe version blocks
 *   the merge. Mark it as required on these branches;
 * - in `publish.yml` before changesets/action, as a backstop for releases from another line that
 *   land after the PR check passed. Failing there leaves the version commit merged but unpublished.
 *
 * Release lines compute versions independently, so a version about to be published may:
 * - already be on npm, published from another line (e.g. dev released it after the hotfix branch was
 *   cut). `changeset publish` treats it as "already published" and skips it without failing;
 * - be lower than npm's `latest` (e.g. hotfix 2.4.1 after dev released 2.5.0). Publishing it with
 *   `--tag latest` would move `latest` back.
 * Either fails the job.
 *
 * "About to be published" = publishable packages whose version changed between the base commit and
 * the checked commit (only the release PR changes versions). A version already on npm is allowed when
 * changesets tagged it on this line (its `<pkg>@<version>` tag is an ancestor of the checked commit),
 * e.g. when re-running after a partial publish.
 *
 * Skipped while changesets are pending: changesets/action then runs the version script and opens the
 * release PR instead of publishing. Pending is decided as changesets/action does (in pre mode,
 * changesets already versioned in it don't count). PRs other than the release PR keep changesets or
 * change no versions, so the check passes for them.
 *
 * Input (env):
 * - BASE_SHA: PR check `github.event.pull_request.base.sha`; push `github.event.before`
 * - GITHUB_SHA: the checked commit (PR merge commit, or the pushed commit)
 *
 * Usage: tsx ./scripts/release/guards/release-versions-guard.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readPreState } from '@changesets/pre';
import { readChangesets } from '@changesets/read';
import { runMain } from '../../changesets/utils';
import semver from 'semver';
import {
  changedVersions,
  git,
  isUnsetSha,
  npmInfo,
  taggedOnThisLine,
  type NpmInfo,
} from '../release-state';

export interface ReleaseCandidate {
  name: string;
  version: string;
  npm: NpmInfo | null;
  /** The version's `<pkg>@<version>` tag is an ancestor of the pushed commit. */
  taggedOnThisLine: boolean;
}

/** Why publishing this version is unsafe, or null when it is fine. */
export function versionProblem({
  name,
  version,
  npm,
  taggedOnThisLine,
}: ReleaseCandidate): string | null {
  if (!npm) return null; // first publish of the package
  if (npm.versions.includes(version) && !taggedOnThisLine) {
    return `${name}@${version} is already on npm, published from another release line; changeset publish would skip it silently.`;
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

async function main(): Promise<void> {
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
    taggedOnThisLine: taggedOnThisLine(pkg, sha),
  }));

  if (candidates.length === 0) {
    console.log('No package versions changed. Nothing to check.');
    return;
  }

  const problems = candidates.map(versionProblem).filter((p): p is string => p !== null);
  candidates.forEach((c) =>
    console.log(`  ${c.name}@${c.version} (npm latest: ${c.npm?.latest ?? 'unpublished'})`)
  );
  if (problems.length > 0) {
    throw new Error(
      `Unsafe release versions:\n${problems.map((p) => `  - ${p}`).join('\n')}\n` +
        'Another line released these packages first. Re-cut the branch from the latest release ' +
        '(hotfix / feature release: re-run Prepare Hotfix / Feature Release) so versions are computed from it.'
    );
  }
  console.log('✅ Release versions are new and not lower than npm latest.');
}

runMain(import.meta.url, main);
