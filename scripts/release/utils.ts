/**
 * Shared helpers of the release scripts (`release-branch-guards.ts`, `post-release-sync.ts`, the
 * limited release prep and the legacy branches): git, npm and workspace state.
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import semver from 'semver';

export interface NpmInfo {
  versions: string[];
  latest?: string;
}

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

/** An unset commit: empty, or GitHub's all-zero `before` of a branch's first push. */
export const isUnsetSha = (sha: string | undefined): boolean => !sha || /^0+$/.test(sha);

/**
 * A branch's prefix, the key of the per-branch Maps (release info, post-release steps, guards):
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
 * npm versions and dist-tags of a package, or null when it was never published. `--prefer-online`
 * revalidates npm's cached metadata (the registry allows 5 minutes), so a version published moments
 * ago in the same job isn't missed.
 */
export function npmInfo(name: string): NpmInfo | null {
  try {
    const args = ['view', name, 'versions', 'dist-tags', '--json', '--prefer-online'];
    const out = execFileSync('npm', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    });
    const info = JSON.parse(out);
    const versions = Array.isArray(info.versions) ? info.versions : [info.versions];
    return { versions, latest: info['dist-tags']?.latest };
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string };
    if (`${err.stdout ?? ''}${err.stderr ?? ''}`.includes('E404')) return null;
    throw error;
  }
}

function versionAt(sha: string, manifestPath: string): string | null {
  const manifest = tryGit('show', `${sha}:${manifestPath}`); // null: no package at that commit
  return manifest === null ? null : JSON.parse(manifest).version;
}

/**
 * Versions of the workspace's publishable packages at a commit (or ref), keyed by name; a package
 * missing at that commit is left out.
 */
export async function versionsAt(ref: string): Promise<Map<string, string>> {
  const { packages, rootDir } = await getPackages(process.cwd());
  const versions = new Map<string, string>();
  for (const pkg of packages.filter((p) => !p.packageJson.private)) {
    const version = versionAt(ref, repoPath(rootDir, path.join(pkg.dir, 'package.json')));
    if (version) versions.set(pkg.packageJson.name, version);
  }
  return versions;
}

/**
 * A ref's versions (`versionsAt`) hold every released version, or a newer one: the release already
 * reached it (e.g. dev after the cherry-pick, `release/latest` after the sync or a later release).
 */
export function holdsVersions(published: PackageVersion[], versions: Map<string, string>): boolean {
  return published.every((pkg) => {
    const held = versions.get(pkg.name);
    return !!held && semver.gte(held, pkg.version);
  });
}

/** Publishable packages whose version at `sha` differs from `base` (a release commit's bumps). */
export async function changedVersions(base: string, sha: string): Promise<PackageVersion[]> {
  const [before, after] = await Promise.all([versionsAt(base), versionsAt(sha)]);
  return [...after]
    .filter(([name, version]) => before.get(name) !== version)
    .map(([name, version]) => ({ name, version }));
}

/** The `<pkg>@<version>` git tag changesets creates for a published version. */
export const releaseTag = ({ name, version }: PackageVersion): string => `${name}@${version}`;

/** The version's release tag is an ancestor of `sha`, i.e. it was released on this branch. */
export const taggedOnThisBranch = (pkg: PackageVersion, sha: string): boolean =>
  tryGit('merge-base', '--is-ancestor', `refs/tags/${releaseTag(pkg)}`, sha) !== null;
