/**
 * Everything that follows a stable publish to sync monorepo release branches.
 * `publish.yml` runs it after changesets/action publishes. The steps depend on the branch
 * (`POST_RELEASE_STEPS`):
 * - dev (full release): re-create `release/latest` at the release commit;
 * - `release/latest` (limited, hotfix and feature releases): cherry-pick the version bump onto dev
 *   (a PR on conflicts). Its changes came from dev (the limited copy, cherry-picked fixes), so the
 *   bump is all dev lacks;
 * - other branches: none.
 * Every step is idempotent: when one failed, fix the cause and re-run the publish workflow.
 *
 * Input (env):
 * - GITHUB_REF_NAME: the release branch
 * - RELEASE_SHA: the release commit (default: GITHUB_SHA, then HEAD); must be on the checked-out branch
 * - PUBLISHED_PACKAGES: changesets/action `published-packages` JSON (optional)
 * - GH_TOKEN: for the conflict PR to dev
 *
 * Usage: tsx ./scripts/release/post-release-sync.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';
import { runMain } from '../changesets/utils';
import { git, tryGit, repoPath, type PackageVersion, branchPrefix } from './utils';
import { MAIN_BRANCH, RELEASE_LATEST } from '../constants';

/** Post-release steps by branch prefix (`branchPrefix`), run in order (see header). */
const POST_RELEASE_STEPS = new Map<string, Step[]>([
  [MAIN_BRANCH, [latestBranchSync]],
  [RELEASE_LATEST, [devBranchSync]],
]);

/** The release a post-release run is for. */
export interface SyncContext {
  branch: string;
  releaseSha: string;
  published: PackageVersion[];
}

// eslint-disable-next-line no-unused-vars
type Step = (ctx: SyncContext) => unknown;

/**
 * Whether `ref` holds every published version or a newer one: the release already reached it (e.g.
 * dev after the cherry-pick, `release/latest` after the sync or a later release).
 */
async function holdsRelease(ref: string, published: PackageVersion[]): Promise<boolean> {
  const { packages, rootDir } = await getPackages(process.cwd());
  return published.every(({ name, version }) => {
    const pkg = packages.find((p) => p.packageJson.name === name);
    const manifestPath = pkg && repoPath(rootDir, path.join(pkg.dir, 'package.json'));
    // null: no such package at that ref
    const manifest = manifestPath ? tryGit('show', `${ref}:${manifestPath}`) : null;
    return manifest !== null && semver.gte(JSON.parse(manifest).version, version);
  });
}

/**
 * Dev release: re-create `release/latest` at the release commit. Skipped when it already holds the
 * release or newer (a re-run after a later release must not roll it back).
 */
export async function latestBranchSync({ releaseSha, published }: SyncContext): Promise<void> {
  if (
    tryGit('fetch', 'origin', RELEASE_LATEST) !== null &&
    (await holdsRelease(`origin/${RELEASE_LATEST}`, published))
  ) {
    console.log(`${RELEASE_LATEST} already holds these versions or newer; nothing to sync.`);
    return;
  }
  git('push', '-f', 'origin', `${releaseSha}:refs/heads/${RELEASE_LATEST}`);
  console.log(`✅ Re-created ${RELEASE_LATEST} at ${releaseSha.slice(0, 7)}.`);
}

/** `release/latest` release: cherry-picks the version bump onto dev (see header). */
export async function devBranchSync({ branch, releaseSha, published }: SyncContext): Promise<void> {
  git('fetch', 'origin', MAIN_BRANCH);
  if (await holdsRelease(`origin/${MAIN_BRANCH}`, published)) {
    console.log(`  ${MAIN_BRANCH} already has these versions; nothing to cherry-pick.`);
    return;
  }

  // a merge-commit release needs -m 1; a squash/rebase merge is single-parent
  const parents = git('rev-list', '--parents', '-n', '1', releaseSha).split(' ').length - 1;
  const mainline = parents >= 2 ? ['-m', '1'] : [];
  git('checkout', '-q', '-B', MAIN_BRANCH, `origin/${MAIN_BRANCH}`);
  if (tryGit('cherry-pick', ...mainline, releaseSha) !== null) {
    git('push', 'origin', `HEAD:${MAIN_BRANCH}`);
    console.log(`  cherry-picked ${releaseSha.slice(0, 7)} onto ${MAIN_BRANCH}`);
    return;
  }

  openConflictPr(branch, releaseSha);
}

/**
 * The cherry-pick onto dev conflicted: commits the conflicted state on a sync branch and opens a PR
 * to dev, so the conflict markers are resolved and reviewed before landing there.
 */
function openConflictPr(branch: string, releaseSha: string): void {
  // one per release: releases from the same branch must not overwrite each other's conflict PR
  const syncBranch = `chore/sync-${branch.replace(/\//g, '-')}-${releaseSha.slice(0, 7)}-to-dev`;
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
}

/**
 * Runs the steps one by one and stops at the first failure, so a failure leaves the later steps
 * undone rather than half-applied. Every step is idempotent: fix the cause and re-run.
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

/** Runs the post-release steps of the branch's prefix; throws at the first failing step. */
export async function syncRelease(
  branch: string,
  releaseSha: string,
  published: PackageVersion[]
): Promise<void> {
  const steps = POST_RELEASE_STEPS.get(branchPrefix(branch)) ?? [];
  await runSteps(steps, { branch, releaseSha, published });
}

async function main(): Promise<void> {
  const branch = process.env.GITHUB_REF_NAME;
  if (!branch) throw new Error('GITHUB_REF_NAME is not set.');
  const releaseSha = git('rev-parse', process.env.RELEASE_SHA || process.env.GITHUB_SHA || 'HEAD');
  if (tryGit('merge-base', '--is-ancestor', releaseSha, 'HEAD') === null) {
    throw new Error(`${releaseSha} is not on ${branch}; pass the release commit of this branch.`);
  }

  // changesets/action's published-packages when run from publish.yml
  const reported: PackageVersion[] = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]');
  if (reported.length === 0) {
    console.log(`No package of release ${releaseSha.slice(0, 7)} is on npm; nothing to sync.`);
    return;
  }
  console.log(
    `Release ${releaseSha.slice(0, 7)} on ${branch}: ${reported
      .map(({ name, version }) => `${name}@${version}`)
      .join(', ')}`
  );

  await syncRelease(branch, releaseSha, reported);
  console.log('\n✅ Post-release sync complete.');
}

runMain(import.meta.url, main);
