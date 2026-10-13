/**
 * Keeps the `release/latest` branch holding strictly released code. Hotfix / feature release
 * branches (`prep_hotfix_feature_release.yml`) and legacy branches are cut from its head.
 *
 * Called by `post-release-sync.ts` after a stable publish from dev, `release/limited/*` or
 * `release/hotfix/*` (legacy lines never touch it):
 * - dev release: re-create `release/latest` at the published commit;
 * - limited / hotfix release: overlay only the published packages' directories from the published
 *   commit onto `release/latest`. Every other package keeps the state of its last release: packages
 *   in scope but not bumped may hold unreleased code, and a hotfix branch may be older than
 *   `release/latest` by the time it publishes. Then refresh `yarn.lock` (publish installs with
 *   `--immutable`) and commit.
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { getPackages } from '@manypkg/get-packages';
import { releaseLine } from './release-line';
import {
  git,
  releaseTag,
  repoPath,
  updateLockfile,
  type PackageVersion,
  type WorkspacePackage,
} from './release-state';

export const RELEASE_LATEST = 'release/latest';

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

/** Dev release: re-create `release/latest` at the published commit. */
export function copyDevToLatest(releaseSha: string): void {
  git('push', '-f', 'origin', `${releaseSha}:refs/heads/${RELEASE_LATEST}`);
  console.log(`✅ Re-created ${RELEASE_LATEST} at ${releaseSha.slice(0, 7)}.`);
}

/**
 * Limited / hotfix release: overlay the published packages' directories from the published commit
 * onto `release/latest`, refresh `yarn.lock` and commit.
 */
export async function copyLimitedToLatest(
  releaseSha: string,
  message: string,
  published: PackageVersion[]
): Promise<void> {
  try {
    git('fetch', 'origin', RELEASE_LATEST);
  } catch {
    throw new Error(
      `${RELEASE_LATEST} does not exist yet. Create it once from the last dev release commit, ` +
        `e.g. git push origin <sha>:refs/heads/${RELEASE_LATEST}.`
    );
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
      git('commit', '-q', '-m', `[ci] ${message}`);
      git('push', 'origin', `HEAD:refs/heads/${RELEASE_LATEST}`);
    }
    console.log(`✅ Synced ${publishedPackages.join(', ')} onto ${RELEASE_LATEST}.`);
  } finally {
    git('checkout', '-q', '-f', '--detach', releaseSha);
  }
}

/**
 * Brings `release/latest` up to a release: re-created at the release commit for dev, the published
 * packages overlaid for limited / hotfix releases. Other lines are skipped.
 */
export async function syncLatestBranch(
  branch: string,
  releaseSha: string,
  published: PackageVersion[]
): Promise<void> {
  const line = releaseLine(branch);
  if (!line.syncsLatest) {
    console.log(`${branch} releases don't update ${RELEASE_LATEST}; skipping.`);
    return;
  }
  if (line.type === 'full') {
    copyDevToLatest(releaseSha);
  } else {
    const message = `Latest release from ${branch}: ${published.map(releaseTag).join(', ')}`;
    await copyLimitedToLatest(releaseSha, message, published);
  }
}
