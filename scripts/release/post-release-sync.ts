/**
 * Everything that follows a stable publish, in one idempotent script. `publish.yml` runs it
 * after changesets/action publishes; `post_release_sync.yml` runs the same script by hand to recover
 * when the publish job failed part-way (some packages published, the follow-up steps skipped).
 *
 * The published packages are changesets/action's `published-packages` (when run from publish.yml)
 * plus the release commit's other packages that are on npm: publishable packages whose version
 * changed in the release (`BASE_SHA`..`RELEASE_SHA`). A re-run after a partial publish therefore
 * sees every package of the release, including those an earlier attempt published (changeset
 * publish only reports what it published itself), and a version published moments ago counts even
 * while npm's metadata lags.
 *
 * Steps (each one is idempotent; a failing step doesn't stop the others, the script fails at the end):
 * 1. restore missing `<pkg>@<version>` tags at the release commit (changesets/action pushes them
 *    only after a fully successful publish; the release guard and legacy branches rely on them);
 * 2. create legacy branches for product majors (`create-legacy-branches.ts`), cut from
 *    `release/latest` while it still holds the previous release, so before step 3;
 * 3. sync `release/latest` (`sync-latest-branch.ts`; dev, limited, hotfix);
 * 4. limited / hotfix releases: cherry-pick the version bump onto dev, unless dev already has these
 *    versions; on conflicts, open a PR to dev instead.
 *
 * Input (env):
 * - GITHUB_REF_NAME: the release branch
 * - RELEASE_SHA: the release commit (default: GITHUB_SHA, then HEAD); must be on the checked-out branch
 * - BASE_SHA: the commit before the release (default: the release commit's first parent)
 * - PUBLISHED_PACKAGES: changesets/action `published-packages` JSON (optional; absent in a recovery)
 * - GH_TOKEN: for the conflict PR to dev
 *
 * Usage: tsx ./scripts/release/post-release-sync.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import { runMain } from '../changesets/utils';
import semver from 'semver';
import { createLegacyBranches } from './legacy/create-legacy-branches';
import {
  changedVersions,
  git,
  gitSucceeds,
  isUnsetSha,
  npmInfo,
  releaseTag,
  versionsAt,
  type PackageVersion,
} from './release-state';
import { MAIN_BRANCH, releaseLine } from './release-line';
import { syncLatestBranch } from './sync-latest-branch';

/**
 * The release's published packages: those changesets/action reports for this run (authoritative,
 * even while npm metadata lags) plus the release's other packages that are on npm (published by an
 * earlier attempt).
 */
export function releasedPackages(
  changed: PackageVersion[],
  lookup: typeof npmInfo,
  reported: PackageVersion[] = []
): PackageVersion[] {
  const isReported = (pkg: PackageVersion) =>
    reported.some((r) => r.name === pkg.name && r.version === pkg.version);
  const fromNpm = changed.filter(
    (pkg) => !isReported(pkg) && lookup(pkg.name)?.versions.includes(pkg.version)
  );
  return [...reported, ...fromNpm];
}

/** Dev already holds these versions (or newer): the bump was cherry-picked before. */
export function devHasVersions(
  published: PackageVersion[],
  devVersions: Map<string, string>
): boolean {
  return published.every((pkg) => {
    const dev = devVersions.get(pkg.name);
    return !!dev && semver.gte(dev, pkg.version);
  });
}

/** Creates and pushes the release's missing `<pkg>@<version>` tags at the release commit. */
export function restoreReleaseTags(published: PackageVersion[], releaseSha: string): void {
  for (const pkg of published) {
    const tag = releaseTag(pkg);
    if (git('ls-remote', '--tags', 'origin', `refs/tags/${tag}`)) continue;
    git('tag', '-f', '-a', tag, '-m', tag, releaseSha);
    git('push', 'origin', `refs/tags/${tag}`);
    console.log(`  restored tag ${tag}`);
  }
}

/** Cherry-picks the release's version bump onto dev (see header, step 4). */
export async function cherryPickToDev(
  branch: string,
  releaseSha: string,
  published: PackageVersion[]
): Promise<'picked' | 'already-on-dev' | 'conflict-pr'> {
  git('fetch', 'origin', MAIN_BRANCH);
  if (devHasVersions(published, await versionsAt(`origin/${MAIN_BRANCH}`))) {
    console.log(`  ${MAIN_BRANCH} already has these versions; nothing to cherry-pick.`);
    return 'already-on-dev';
  }

  // a merge-commit release needs -m 1; a squash/rebase merge is single-parent
  const parents = git('rev-list', '--parents', '-n', '1', releaseSha).split(' ').length - 1;
  const mainline = parents >= 2 ? ['-m', '1'] : [];
  git('checkout', '-q', '-B', MAIN_BRANCH, `origin/${MAIN_BRANCH}`);
  if (gitSucceeds('cherry-pick', ...mainline, releaseSha)) {
    git('push', 'origin', `HEAD:${MAIN_BRANCH}`);
    console.log(`  cherry-picked ${releaseSha.slice(0, 7)} onto ${MAIN_BRANCH}`);
    return 'picked';
  }

  // Conflicts: commit the conflicted state on a sync branch and open a PR so the conflict markers
  // can be resolved and reviewed before landing on dev.
  const syncBranch = `chore/sync-${branch.replace(/\//g, '-')}-to-dev`;
  git('add', '-A');
  git('-c', 'core.editor=true', 'cherry-pick', '--continue');
  git('push', '-f', 'origin', `HEAD:refs/heads/${syncBranch}`);
  try {
    execFileSync(
      'gh',
      [
        'pr',
        'create',
        '--base',
        MAIN_BRANCH,
        '--head',
        syncBranch,
        '--title',
        `[csdk] Sync ${branch} release to dev`,
        '--body',
        `Automated cherry-pick of \`${releaseSha}\` (${branch} version bump) onto dev hit ` +
          'conflicts. Resolve the conflict markers in this PR before merging.',
      ],
      { stdio: 'inherit' }
    );
  } catch {
    console.log(`  a PR for ${syncBranch} may already exist.`);
  }
  console.log(`  ⚠️ cherry-pick conflicts; opened a PR from ${syncBranch} to ${MAIN_BRANCH}`);
  return 'conflict-pr';
}

/** Runs every step, even after a failure, and returns the failed steps' errors. */
type Step = [name: string, run: () => unknown];

export async function runSteps(steps: Step[]): Promise<string[]> {
  const failures: string[] = [];
  for (const [name, run] of steps) {
    console.log(`\n▶ ${name}`);
    try {
      await run();
    } catch (error) {
      const message = `${name}: ${(error as Error).message}`;
      console.error(`❌ ${message}`);
      failures.push(message);
    }
  }
  return failures;
}

/** Runs the post-release steps for a release (see header) and returns the failed ones. */
export async function syncRelease(
  branch: string,
  releaseSha: string,
  published: PackageVersion[]
): Promise<string[]> {
  // legacy branches first: they are cut from release/latest's state before this release
  const failures = await runSteps([
    ['Restore release tags', () => restoreReleaseTags(published, releaseSha)],
    ['Create legacy branches', () => createLegacyBranches(published)],
  ]);
  const legacyFailed = failures.some((f) => f.startsWith('Create legacy branches:'));

  const steps: Step[] = [];
  if (legacyFailed) {
    // keep release/latest at the previous release, so a re-run can still cut the legacy branch
    failures.push(
      'Sync release/latest: skipped while a legacy branch is missing; re-run after fixing'
    );
  } else {
    steps.push(['Sync release/latest', () => syncLatestBranch(branch, releaseSha, published)]);
  }
  if (releaseLine(branch).sideLine) {
    steps.push([
      'Cherry-pick version bump to dev',
      () => cherryPickToDev(branch, releaseSha, published),
    ]);
  }
  failures.push(...(await runSteps(steps)));
  return failures;
}

async function main(): Promise<void> {
  const branch = process.env.GITHUB_REF_NAME;
  if (!branch) throw new Error('GITHUB_REF_NAME is not set.');
  const releaseSha = git('rev-parse', process.env.RELEASE_SHA || process.env.GITHUB_SHA || 'HEAD');
  if (!gitSucceeds('merge-base', '--is-ancestor', releaseSha, 'HEAD')) {
    throw new Error(`${releaseSha} is not on ${branch}; pass the release commit of this branch.`);
  }
  const envBase = process.env.BASE_SHA ?? '';
  const base = isUnsetSha(envBase) ? `${releaseSha}^1` : envBase;

  // changesets/action's published-packages when run from publish.yml; absent in a manual recovery
  const reported: PackageVersion[] = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]');
  const published = releasedPackages(await changedVersions(base, releaseSha), npmInfo, reported);
  if (published.length === 0) {
    console.log(`No package of release ${releaseSha.slice(0, 7)} is on npm; nothing to sync.`);
    return;
  }
  console.log(
    `Release ${releaseSha.slice(0, 7)} on ${branch}: ${published.map(releaseTag).join(', ')}`
  );

  const failures = await syncRelease(branch, releaseSha, published);
  if (failures.length > 0) {
    throw new Error(`Post-release sync incomplete:\n${failures.map((f) => `  - ${f}`).join('\n')}`);
  }
  console.log('\n✅ Post-release sync complete.');
}

runMain(import.meta.url, main);
