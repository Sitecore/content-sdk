/**
 * Everything that follows a stable publish to sync monorepo release branches.
 * `publish.yml` runs it after changesets/action publishes;
 *
 * Input (env):
 * - GITHUB_REF_NAME: the release branch
 * - RELEASE_SHA: the release commit (default: GITHUB_SHA, then HEAD); must be on the checked-out branch
 * - BASE_SHA: the commit before the release (default: the release commit's first parent)
 * - PUBLISHED_PACKAGES: changesets/action `published-packages` JSON (optional; absent in a retry)
 * - GH_TOKEN: for the conflict PR to dev
 *
 * Usage: tsx ./scripts/release/post-release-sync.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import { getPackages } from '@manypkg/get-packages';
import { runMain } from '../changesets/utils';
import { createLegacyBranches, refreshLegacyLockfiles } from './legacy/create-legacy-branches';
import {
  changedVersions,
  git,
  tryGit,
  holdsVersions,
  isUnsetSha,
  npmInfo,
  releaseTag,
  repoPath,
  updateLockfile,
  versionsAt,
  type PackageVersion,
  type WorkspacePackage,
  branchPrefix,
} from './utils';
import { MAIN_BRANCH, RELEASE_LATEST } from '../constants';

/** Post-release steps by branch prefix (`branchPrefix`), run in order (see header). */
const POST_RELEASE_STEPS = new Map<string, Step[]>([
  [MAIN_BRANCH, [createLegacyBranchesOnMajor, latestBranchSync, refreshLegacyLockfiles]],
  [
    'release/limited',
    [createLegacyBranchesOnMajor, latestPackagesSync, refreshLegacyLockfiles, devBranchSync],
  ],
  ['release/hotfix', [latestPackagesSync, refreshLegacyLockfiles, devBranchSync]],
]);

/** Other branches (legacy, ver1, betas, ...) don't touch `release/latest` or dev. */
const OTHER_STEPS: Step[] = [refreshLegacyLockfiles];

/** The release a post-release run is for. */
export interface SyncContext {
  branch: string;
  releaseSha: string;
  published: PackageVersion[];
}

// eslint-disable-next-line no-unused-vars
type Step = (ctx: SyncContext) => unknown;

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

/** Repo-relative directories of the published packages. Throws on a package not in the workspace. */
export function publishedPackageDirs(
  packages: WorkspacePackage[],
  rootDir: string,
  published: PackageVersion[]
): string[] {
  const dirs = new Map(packages.map((pkg) => [pkg.packageJson.name, pkg.dir]));
  return published.map(({ name }) => {
    const dir = dirs.get(name);
    if (!dir) throw new Error(`Published package ${name} is not in the workspace.`);
    return repoPath(rootDir, dir);
  });
}

/**
 * Dev release: re-create `release/latest` at the release commit. Skipped when it already holds the
 * release or newer (a re-run after a later release must not roll it back).
 */
export async function latestBranchSync({ releaseSha, published }: SyncContext): Promise<void> {
  if (
    tryGit('fetch', 'origin', RELEASE_LATEST) !== null &&
    holdsVersions(published, await versionsAt(`origin/${RELEASE_LATEST}`))
  ) {
    console.log(`${RELEASE_LATEST} already holds these versions or newer; nothing to sync.`);
    return;
  }
  git('push', '-f', 'origin', `${releaseSha}:refs/heads/${RELEASE_LATEST}`);
  console.log(`✅ Re-created ${RELEASE_LATEST} at ${releaseSha.slice(0, 7)}.`);
}

/**
 * Limited / hotfix release: overlay the published packages' directories from the release commit
 * onto `release/latest`, refresh `yarn.lock` and commit. Skipped when it already holds the release
 * or newer (a re-run after a later release must not roll it back).
 */
export async function latestPackagesSync({
  branch,
  releaseSha,
  published,
}: SyncContext): Promise<void> {
  if (tryGit('fetch', 'origin', RELEASE_LATEST) === null) {
    throw new Error(
      `${RELEASE_LATEST} does not exist yet. Create it once from the last dev release commit, ` +
        `e.g. git push origin <sha>:refs/heads/${RELEASE_LATEST}.`
    );
  }
  if (holdsVersions(published, await versionsAt(`origin/${RELEASE_LATEST}`))) {
    console.log(`${RELEASE_LATEST} already holds these versions or newer; nothing to sync.`);
    return;
  }

  const { packages, rootDir } = await getPackages(process.cwd());
  const publishedPackages = publishedPackageDirs(packages, rootDir, published);

  git('checkout', '-q', '-B', RELEASE_LATEST, `origin/${RELEASE_LATEST}`);
  try {
    git('restore', `--source=${releaseSha}`, '--staged', '--worktree', '--', ...publishedPackages);
    updateLockfile();
    git('add', '--', 'yarn.lock', ...publishedPackages);
    if (git('diff', '--cached', '--name-only') === '') {
      console.log(`${RELEASE_LATEST} already holds these packages; nothing to commit.`);
    } else {
      const released = published.map(releaseTag).join(', ');
      git('commit', '-q', '-m', `[ci] Latest release from ${branch}: ${released}`);
      git('push', 'origin', `HEAD:refs/heads/${RELEASE_LATEST}`);
    }
    console.log(`✅ Synced ${publishedPackages.join(', ')} onto ${RELEASE_LATEST}.`);
  } finally {
    git('checkout', '-q', '-f', '--detach', releaseSha);
  }
}

/** Cherry-picks the release's version bump onto dev (see header, step 4). */
export async function devBranchSync({
  branch,
  releaseSha,
  published,
}: SyncContext): Promise<'picked' | 'already-on-dev' | 'conflict-pr'> {
  git('fetch', 'origin', MAIN_BRANCH);
  if (holdsVersions(published, await versionsAt(`origin/${MAIN_BRANCH}`))) {
    console.log(`  ${MAIN_BRANCH} already has these versions; nothing to cherry-pick.`);
    return 'already-on-dev';
  }

  // a merge-commit release needs -m 1; a squash/rebase merge is single-parent
  const parents = git('rev-list', '--parents', '-n', '1', releaseSha).split(' ').length - 1;
  const mainline = parents >= 2 ? ['-m', '1'] : [];
  git('checkout', '-q', '-B', MAIN_BRANCH, `origin/${MAIN_BRANCH}`);
  if (tryGit('cherry-pick', ...mainline, releaseSha) !== null) {
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

/**
 * Runs the steps one by one and stops at the first failure: a later step may depend on an earlier
 * one (the `release/latest` sync must wait for the legacy branches, which are cut from it). Every
 * step is idempotent: fix the cause and re-run (Retry Failed Release Sync).
 */
export async function runSteps(steps: Step[], ctx: SyncContext): Promise<void> {
  for (const step of steps) {
    console.log(`\n▶ ${step.name}`);
    try {
      await step(ctx);
    } catch (error) {
      throw new Error(`${step.name}: ${(error as Error).message}`);
    }
  }
}

/** Legacy branches are cut from `release/latest` before this release, so this runs before the sync. */
function createLegacyBranchesOnMajor({ published }: SyncContext): Promise<void> {
  return createLegacyBranches(published);
}

/** Runs the post-release steps of the branch's prefix; throws at the first failing step. */
export async function syncRelease(
  branch: string,
  releaseSha: string,
  published: PackageVersion[]
): Promise<void> {
  const steps = POST_RELEASE_STEPS.get(branchPrefix(branch)) ?? OTHER_STEPS;
  await runSteps(steps, { branch, releaseSha, published });
}

async function main(): Promise<void> {
  const branch = process.env.GITHUB_REF_NAME;
  if (!branch) throw new Error('GITHUB_REF_NAME is not set.');
  const releaseSha = git('rev-parse', process.env.RELEASE_SHA || process.env.GITHUB_SHA || 'HEAD');
  if (tryGit('merge-base', '--is-ancestor', releaseSha, 'HEAD') === null) {
    throw new Error(`${releaseSha} is not on ${branch}; pass the release commit of this branch.`);
  }
  const envBase = process.env.BASE_SHA ?? '';
  const base = isUnsetSha(envBase) ? `${releaseSha}^1` : envBase;

  // changesets/action's published-packages when run from publish.yml; absent in a retry
  const reported: PackageVersion[] = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]');
  const published = releasedPackages(await changedVersions(base, releaseSha), npmInfo, reported);
  if (published.length === 0) {
    console.log(`No package of release ${releaseSha.slice(0, 7)} is on npm; nothing to sync.`);
    return;
  }
  console.log(
    `Release ${releaseSha.slice(0, 7)} on ${branch}: ${published.map(releaseTag).join(', ')}`
  );

  await syncRelease(branch, releaseSha, published);
  console.log('\n✅ Post-release sync complete.');
}

runMain(import.meta.url, main);
