/**
 * Shared helpers of the release scripts (`post-release-sync.ts`, the limited release prep): git,
 * npm and workspace state.
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import path from 'path';

export interface PackageVersion {
  name: string;
  version: string;
}

/** The part of a `@manypkg/get-packages` package the release scripts use. */
export interface WorkspacePackage {
  dir: string;
  packageJson: { name: string };
}

/** A path inside the repository as git expects it: relative to the root, forward slashes. */
export const repoPath = (rootDir: string, absolutePath: string): string =>
  path.relative(rootDir, absolutePath).split(path.sep).join('/');

/** Repo-relative directories of the named workspace packages. Throws on a package not in it. */
export function packageDirs(
  packages: WorkspacePackage[],
  rootDir: string,
  names: string[]
): string[] {
  const dirs = new Map(packages.map((pkg) => [pkg.packageJson.name, pkg.dir]));
  return names.map((name) => {
    const dir = dirs.get(name);
    if (!dir) throw new Error(`${name} is not in the workspace.`);
    return repoPath(rootDir, dir);
  });
}

/**
 * A branch's prefix, the key of the per-branch Maps (post-release steps):
 * `release/<name>` (the first two path segments), else the whole branch (e.g. `dev`).
 */
export const branchPrefix = (branch: string): string =>
  /^release\/[^/]+/.exec(branch)?.[0] ?? branch;

/** Rewrites `yarn.lock` for the current workspace without linking (`--mode=update-lockfile`). */
export function updateLockfile(): void {
  execFileSync('yarn', ['install', '--mode=update-lockfile'], {
    stdio: 'inherit',
    env: { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: 'false' },
    shell: process.platform === 'win32',
  });
}

/** Runs git and returns its trimmed output; throws when git fails. */
export function git(...args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

/**
 * `git` for calls where failure is an expected answer (a missing ref or file, `merge-base
 * --is-ancestor`, a conflicting cherry-pick): the output, or null when git failed.
 */
export function tryGit(...args: string[]): string | null {
  try {
    return git(...args);
  } catch {
    return null;
  }
}

/**
 * A package's npm `latest` version; undefined when it was never published (or has no `latest`).
 * `--prefer-online` revalidates npm's cached metadata (the registry allows 5 minutes), so a version
 * published moments ago in the same job isn't missed.
 */
export function npmLatest(name: string): string | undefined {
  try {
    const args = ['view', name, 'dist-tags.latest', '--prefer-online'];
    const out = execFileSync('npm', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    });
    return out.trim() || undefined;
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string };
    if (`${err.stdout ?? ''}${err.stderr ?? ''}`.includes('E404')) return undefined;
    throw error;
  }
}
