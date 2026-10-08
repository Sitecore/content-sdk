/**
 * Guardrail for release lines that publish to npm `latest` from a side branch (`release/limited/*`,
 * `release/hotfix/*`). Runs in `publish.yml` before changesets/action.
 *
 * Release lines compute versions independently, so a version this push is about to publish may:
 * - already be on npm, published from another line (e.g. dev released it after the hotfix branch was
 *   cut). `changeset publish` treats it as "already published" and skips it without failing;
 * - be lower than npm's `latest` (e.g. hotfix 2.4.1 after dev released 2.5.0). Publishing it with
 *   `--tag latest` would move `latest` back.
 * Either fails the job.
 *
 * "About to publish" = publishable packages whose version changed between the commit before the push
 * and the pushed commit (only the merged version PR changes versions). A version already on npm is
 * allowed when changesets tagged it on this line (its `<pkg>@<version>` tag is an ancestor of the
 * pushed commit), e.g. when re-running after a partial publish.
 *
 * Input (env): BEFORE_SHA (`github.event.before`), GITHUB_SHA (pushed commit).
 *
 * Usage: tsx ./scripts/release/check-release-versions.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import { isMainModule } from '../changesets/utils';
import { compareSemver } from './create-legacy-branches';

interface NpmInfo {
  versions: string[];
  latest?: string;
}

export interface ReleaseCandidate {
  name: string;
  version: string;
  npm: NpmInfo | null;
  /** The version's `<pkg>@<version>` tag is an ancestor of the pushed commit. */
  taggedOnThisLine: boolean;
}

/** Why publishing this version is unsafe, or null when it is fine. */
export function versionProblem({ name, version, npm, taggedOnThisLine }: ReleaseCandidate): string | null {
  if (!npm) return null; // first publish of the package
  if (npm.versions.includes(version) && !taggedOnThisLine) {
    return `${name}@${version} is already on npm, published from another release line; changeset publish would skip it silently.`;
  }
  if (npm.latest && compareSemver(version, npm.latest) < 0) {
    return `${name}@${version} is lower than npm latest ${npm.latest}; publishing it would move latest back.`;
  }
  return null;
}

const ZERO_SHA = /^0+$/;

function git(...args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function versionAt(sha: string, manifestPath: string): string | null {
  try {
    return JSON.parse(git('show', `${sha}:${manifestPath}`)).version;
  } catch {
    return null; // package did not exist at that commit
  }
}

function npmInfo(name: string): NpmInfo | null {
  try {
    const out = execFileSync('npm', ['view', name, 'versions', 'dist-tags', '--json'], {
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

function taggedOnThisLine(tag: string, sha: string): boolean {
  try {
    git('merge-base', '--is-ancestor', `refs/tags/${tag}`, sha);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const before = process.env.BEFORE_SHA ?? '';
  const sha = process.env.GITHUB_SHA || git('rev-parse', 'HEAD');
  if (!before || ZERO_SHA.test(before)) {
    console.log('New branch push; no versions changed. Nothing to check.');
    return;
  }

  const { packages, rootDir } = await getPackages(process.cwd());
  const candidates: ReleaseCandidate[] = [];
  for (const pkg of packages.filter((p) => !p.packageJson.private)) {
    const manifest = path.relative(rootDir, path.join(pkg.dir, 'package.json')).split(path.sep).join('/');
    const version = versionAt(sha, manifest);
    if (!version || version === versionAt(before, manifest)) continue;
    const { name } = pkg.packageJson;
    candidates.push({
      name,
      version,
      npm: npmInfo(name),
      taggedOnThisLine: taggedOnThisLine(`${name}@${version}`, sha),
    });
  }

  if (candidates.length === 0) {
    console.log('No package versions changed in this push. Nothing to check.');
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
        '(hotfix: re-run Prepare Hotfix Release) so versions are computed from it.'
    );
  }
  console.log('✅ Release versions are new and not lower than npm latest.');
}

if (isMainModule(import.meta.url)) {
  main().catch((error: unknown) => {
    const err = error as Error;
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}
