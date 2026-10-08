/**
 * Keeps the `release/latest` branch holding strictly released code and tags its head `latest`.
 * Hotfix branches are cut from that tag (`hotfix_release_prep.yml`).
 *
 * Runs in `publish.yml` after a stable publish from dev, `release/limited/*` or `release/hotfix/*`
 * (legacy lines never touch it), with HEAD at the published commit:
 * - dev release: re-create `release/latest` at the published commit;
 * - limited / hotfix release: overlay only the published packages' directories from the published
 *   commit onto `release/latest`. Every other package keeps the state of its last release: packages
 *   in scope but not bumped may hold unreleased code, and a hotfix branch may be older than
 *   `release/latest` by the time it publishes. Then refresh `yarn.lock` (publish installs with
 *   `--immutable`) and commit.
 *
 * Package tags (`<pkg>@<version>`) stay where changesets created them, on the release branch.
 * The checkout is returned to the published commit afterwards.
 *
 * Input (env):
 * - PUBLISHED_PACKAGES: JSON `[{ name, version }]` from changesets/action `published-packages`
 * - GITHUB_REF_NAME: the branch the release was published from
 *
 * Usage: tsx ./scripts/release/sync-latest-branch.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import { isMainModule } from '../changesets/utils';

export const LATEST_BRANCH = 'release/latest';
export const LATEST_TAG = 'latest';
const MAIN_BRANCH = 'dev';

interface PublishedPackage {
  name: string;
  version: string;
}

interface PackageLike {
  dir: string;
  packageJson: { name: string };
}

/** Repo-relative directories of the published packages. Throws on a package not in the workspace. */
export function publishedPackageDirs(
  packages: PackageLike[],
  rootDir: string,
  published: PublishedPackage[]
): string[] {
  const dirs = new Map(packages.map((pkg) => [pkg.packageJson.name, pkg.dir]));
  return published.map(({ name }) => {
    const dir = dirs.get(name);
    if (!dir) throw new Error(`Published package ${name} is not in the workspace.`);
    return path.relative(rootDir, dir).split(path.sep).join('/');
  });
}

export function describePublished(published: PublishedPackage[]): string {
  return published.map((p) => `${p.name}@${p.version}`).join(', ');
}

function git(...args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function tagLatest(message: string): void {
  git('tag', '-f', '-a', LATEST_TAG, 'HEAD', '-m', message);
  git('push', '-f', 'origin', `refs/tags/${LATEST_TAG}`);
}

async function main(): Promise<void> {
  const branch = process.env.GITHUB_REF_NAME;
  const published: PublishedPackage[] = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]');
  if (!branch) throw new Error('GITHUB_REF_NAME is not set.');
  if (published.length === 0) {
    console.log('Nothing was published; release/latest is unchanged.');
    return;
  }

  const releaseSha = git('rev-parse', 'HEAD');
  const message = `Latest release from ${branch}: ${describePublished(published)}`;

  if (branch === MAIN_BRANCH) {
    git('push', '-f', 'origin', `${releaseSha}:refs/heads/${LATEST_BRANCH}`);
    tagLatest(message);
    console.log(`✅ Re-created ${LATEST_BRANCH} at ${releaseSha.slice(0, 7)} and tagged it ${LATEST_TAG}.`);
    return;
  }

  try {
    git('fetch', 'origin', LATEST_BRANCH);
  } catch {
    throw new Error(
      `${LATEST_BRANCH} does not exist yet. Create it once from the last dev release commit, ` +
        `e.g. git push origin <sha>:refs/heads/${LATEST_BRANCH}.`
    );
  }

  const { packages, rootDir } = await getPackages(process.cwd());
  const dirs = publishedPackageDirs(packages, rootDir, published);

  git('checkout', '-q', '-B', LATEST_BRANCH, `origin/${LATEST_BRANCH}`);
  try {
    git('restore', `--source=${releaseSha}`, '--staged', '--worktree', '--', ...dirs);
    execFileSync('yarn', ['install', '--mode=update-lockfile'], {
      stdio: 'inherit',
      env: { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: 'false' },
      shell: process.platform === 'win32',
    });
    git('add', '--', 'yarn.lock', ...dirs);
    if (git('diff', '--cached', '--name-only') === '') {
      console.log(`${LATEST_BRANCH} already holds these packages; nothing to commit.`);
    } else {
      git('commit', '-q', '-m', `[ci] ${message}`);
      git('push', 'origin', `HEAD:refs/heads/${LATEST_BRANCH}`);
    }
    tagLatest(message);
    console.log(`✅ Synced ${dirs.join(', ')} onto ${LATEST_BRANCH} and tagged it ${LATEST_TAG}.`);
  } finally {
    git('checkout', '-q', '-f', '--detach', releaseSha);
  }
}

if (isMainModule(import.meta.url)) {
  main().catch((error: unknown) => {
    const err = error as Error;
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}
