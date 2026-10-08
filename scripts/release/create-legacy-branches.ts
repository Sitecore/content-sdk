/**
 * Creates a legacy maintenance branch when a product package (nextjs or angular) has just
 * received a major-version bump on the mainline release.
 *
 * Intended to run as a post-publish step in `.github/workflows/publish.yml`, gated on a
 * successful stable publish from the mainline branch.
 *
 * Input (env):
 * - PUBLISHED_PACKAGES: JSON array of `{ name, version }` from the changesets/action
 *   `publishedPackages` output.
 *
 * For each configured product that was just published with a new major greater than the
 * previous highest stable major, this branches the latest git tag of that previous major into
 * `release/legacy/<slug>/v<previousMajor>` (i.e. `v<new major - 1>`).
 *
 * Idempotent: skips creation when the target branch already exists on origin. Pushes use the
 * `origin` remote configured earlier in the workflow (authenticated via the GitHub App token).
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execSync } from 'child_process';
import { realpathSync } from 'fs';
import { fileURLToPath } from 'url';

export interface Product {
  /** Full npm package name, as it appears in git release tags (`<name>@<version>`). */
  name: string;
  /** Short identifier used in the legacy branch path. */
  slug: string;
}

interface PublishedPackage {
  name: string;
  version: string;
}

/** What to do for a product after a publish: create a legacy branch, or skip (with a reason). */
export type LegacyBranchPlan =
  | { action: 'create'; targetBranch: string; sourceVersion: string; previousMajor: number }
  | { action: 'skip'; reason: string };

const PRODUCTS: Product[] = [
  { name: '@sitecore-content-sdk/nextjs', slug: 'nextjs' },
  { name: '@sitecore-content-sdk/angular', slug: 'angular' },
];

export const legacyBranch = (slug: string, major: number): string =>
  `release/legacy/${slug}/v${major}`;

function git(args: string, opts: { allowFail?: boolean } = {}): string {
  try {
    return execSync(`git ${args}`, { encoding: 'utf8' }).trim();
  } catch (err) {
    if (opts.allowFail) return '';
    throw err;
  }
}

export function parseSemver(v: string): [number, number, number] | null {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

export function compareSemver(a: string, b: string): number {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) return 0;
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

/** Extracts stable (X.Y.Z) versions from raw `git tag --list "<pkg>@*"` output for a package. */
export function parseStableVersions(pkgName: string, rawTagOutput: string): string[] {
  if (!rawTagOutput) return [];
  return rawTagOutput
    .split('\n')
    .map((tag) => tag.slice(pkgName.length + 1))
    .filter((v) => parseSemver(v) !== null);
}

/**
 * Decides whether a product needs a legacy branch after publishing `publishedVersion`.
 * A branch is created only when the published version is a new major greater than the highest
 * prior stable major; it points at the latest release of that previous major.
 * @param slug - product slug used in the branch path
 * @param publishedVersion - version just published
 * @param otherStableVersions - prior stable versions for the package (excluding the published one)
 */
export function planLegacyBranch(
  slug: string,
  publishedVersion: string,
  otherStableVersions: string[]
): LegacyBranchPlan {
  const newSemver = parseSemver(publishedVersion);
  if (!newSemver) {
    return { action: 'skip', reason: `published version ${publishedVersion} is not a stable semver` };
  }
  if (otherStableVersions.length === 0) {
    return { action: 'skip', reason: 'no prior stable release' };
  }
  const previousMajor = Math.max(...otherStableVersions.map((v) => parseSemver(v)![0]));
  if (newSemver[0] <= previousMajor) {
    return {
      action: 'skip',
      reason: `published ${publishedVersion} is not a major bump (prior max stable major was ${previousMajor})`,
    };
  }
  const latestPrevMajor = otherStableVersions
    .filter((v) => parseSemver(v)![0] === previousMajor)
    .sort(compareSemver)
    .at(-1)!;
  return {
    action: 'create',
    targetBranch: legacyBranch(slug, previousMajor),
    sourceVersion: latestPrevMajor,
    previousMajor,
  };
}

/** Stable (non-prerelease) released versions for a package, read from its git tags. */
function listStableVersionsForPackage(pkgName: string): string[] {
  return parseStableVersions(pkgName, git(`tag --list "${pkgName}@*"`, { allowFail: true }));
}

function branchExistsOnRemote(branch: string): boolean {
  const out = git(`ls-remote --heads origin ${branch}`, { allowFail: true });
  return out.length > 0;
}

function main(): void {
  const publishedJson = process.env.PUBLISHED_PACKAGES;
  if (!publishedJson) {
    console.log('PUBLISHED_PACKAGES not set; nothing to do.');
    return;
  }
  const published: PublishedPackage[] = JSON.parse(publishedJson);
  if (published.length === 0) {
    console.log('No packages were published in this run; nothing to do.');
    return;
  }

  for (const product of PRODUCTS) {
    const justPublished = published.find((p) => p.name === product.name);
    if (!justPublished) continue;

    const stableVersions = listStableVersionsForPackage(product.name);
    const otherStable = stableVersions.filter((v) => v !== justPublished.version);
    const plan = planLegacyBranch(product.slug, justPublished.version, otherStable);

    if (plan.action === 'skip') {
      console.log(`${product.name}: ${plan.reason}; skipping.`);
      continue;
    }

    const sourceTag = `${product.name}@${plan.sourceVersion}`;
    const sourceSha = git(`rev-list -n 1 ${sourceTag}`);

    if (branchExistsOnRemote(plan.targetBranch)) {
      console.log(`${plan.targetBranch} already exists on origin; skipping creation.`);
      continue;
    }

    console.log(`Creating ${plan.targetBranch} from ${sourceTag} (${sourceSha.slice(0, 7)})`);
    execSync(`git push origin ${sourceSha}:refs/heads/${plan.targetBranch}`, { stdio: 'inherit' });
  }

  console.log('✅ Legacy branch maintenance complete.');
}

function isMainModule(): boolean {
  try {
    return !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMainModule()) {
  try {
    main();
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}
