/**
 * Integrated cascade version script using changesets programmatic API
 *
 * Original `changeset version` command does not support cascading version bumps
 * This script replaces `changeset version` with a custom implementation that:
 * 1. Reads pending changesets
 * 2. Cascades major bumps from ANY package to all its dependents
 * 3. Assembles a new release plan with cascade changesets (`getCascadeReleasePlan`, also used by
 *    `prep-limited-release.ts`)
 * 4. Applies the modified release plan
 *
 * Cascading rules:
 * - If package A has a major bump (any bump when --snapshot; a minor bump too while A is 0.x, where a
 * minor is breaking), the version bump is propagated to all packages that depend on A (directly or
 * transitively).
 *
 * With --snapshot: all change types cascade; snapshot semver suffixes are applied via changesets;
 * changelogs are not updated (CI-only; changesets are not removed from the remote branch).
 *
 * Usage: tsx ./scripts/changesets/cascade-version.ts [--dry-run] [--snapshot]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { appendFileSync } from 'fs';
import { assembleReleasePlan } from '@changesets/assemble-release-plan';
import { applyReleasePlan } from '@changesets/apply-release-plan';
import { readChangesets } from '@changesets/read';
import { getCommitsThatAddFiles, getCurrentCommitId } from '@changesets/git';
import { readConfig } from '@changesets/config';
import { readPreState } from '@changesets/pre';
import { getPackages, type Packages } from '@manypkg/get-packages';
import { getDependentsGraph } from '@changesets/get-dependents-graph';
import type {
  Config,
  NewChangeset,
  NewChangesetWithCommit,
  PreState,
  ReleasePlan,
  VersionType,
} from '@changesets/types';
// .ts extensions: release-branch-guards.ts (plain node) imports this module
import { REPO, SCAFFOLDER } from '../constants.ts';
import { runMain } from './utils.ts';

const canaryTag = process.env.CANARY_PREFIX || 'canary';

// List of packages that will get patch bumps instead of minor/major via cascade versioning
const cascadeVersionPatchOnlyPkgs = [SCAFFOLDER];

type PackageChangeset = NewChangesetWithCommit & {
  releaseType: VersionType;
};

function writeGithubOutput(key: string, value: string): void {
  const out = process.env.GITHUB_OUTPUT;
  if (!out) return;
  appendFileSync(out, `${key}=${value}\n`);
}

export function getCascadeChangesets(
  originalChangesets: NewChangeset[],
  packages: Packages,
  isSnapshot?: boolean
) {
  // get per-package changesets for easier processing
  const changesetMap = getPackageChangesetMap(originalChangesets);
  const versions = new Map(
    packages.packages.map((p) => [p.packageJson.name, p.packageJson.version])
  );
  // bumps of a source package that cascade: a minor is breaking while the package is 0.x
  const cascadeChangeTypesFor = (sourcePkg: string): VersionType[] =>
    isSnapshot
      ? ['major', 'minor', 'patch']
      : versions.get(sourcePkg)?.startsWith('0.')
      ? ['major', 'minor']
      : ['major'];
  // package -> all dependents graph/map
  const dependentsGraph = getTransitiveDependents(packages);

  const formatSummary = (changeset: PackageChangeset): string => {
    const shortCommit = changeset.commit?.substring(0, 7);
    const commitLink = shortCommit
      ? ` ([${shortCommit}](https://github.com/${REPO}/commit/${changeset.commit}))`
      : '';
    return `  - ${changeset.summary}${commitLink}`;
  };

  const generateChangesetId = () => {
    const random = crypto.randomUUID();
    return `${'cascade-changeset-' + random}`;
  };

  // Apply additional changesets to dependent packages
  const cascadeChangesets = [] as NewChangeset[];
  dependentsGraph.forEach((dependentPkgs, sourcePkg) => {
    const sourceChangesets = changesetMap.get(sourcePkg);
    if (!sourceChangesets) return;
    const cascadeChangeTypes = cascadeChangeTypesFor(sourcePkg);

    const aggregatedSummaries: Record<VersionType, string[]> = {
      major: [],
      minor: [],
      patch: [],
      none: [],
    };

    sourceChangesets.forEach((sourceChange) => {
      const rt = sourceChange.releaseType;
      if (cascadeChangeTypes.includes(rt)) {
        aggregatedSummaries[rt].push(formatSummary(sourceChange));
      }
    });

    dependentPkgs.forEach((depPkg) => {
      cascadeChangeTypes.forEach((changeType) => {
        if (aggregatedSummaries[changeType].length === 0) return;
        const cascadeReleaseType =
          !isSnapshot && cascadeVersionPatchOnlyPkgs.includes(depPkg) ? 'patch' : changeType;
        const synthethicChange: PackageChangeset = {
          id: generateChangesetId(),
          summary: `${changeType} \`${sourcePkg}\` dependency update:\n${aggregatedSummaries[
            changeType
          ].join('\n')}`,
          releases: [{ name: depPkg, type: cascadeReleaseType }],
          releaseType: cascadeReleaseType,
        };
        cascadeChangesets.push(synthethicChange);
      });
    });
  });
  return cascadeChangesets;
}

/**
 * Release plan for the pending changesets plus their cascade changesets, assembled natively by
 * changesets (dependents, fixed and linked groups, `ignore`, pre mode).
 * With `snapshot` set, every bump type cascades.
 */
export function getCascadeReleasePlan(
  changesets: NewChangeset[],
  packages: Packages,
  config: Config,
  preState: PreState | undefined,
  snapshot?: { tag: string; commit?: string }
): ReleasePlan {
  const cascadeChangesets = getCascadeChangesets(changesets, packages, !!snapshot);
  return assembleReleasePlan(
    [...changesets, ...cascadeChangesets],
    packages,
    config,
    preState,
    snapshot
  );
}

/** The release plan of the workspace's pending changesets (what the release PR would version). */
export async function getReleasePlan(cwd = process.cwd()): Promise<ReleasePlan> {
  const packages = await getPackages(cwd);
  const { config, errors } = await readConfig(cwd, packages);
  if (errors) throw new Error(`Invalid changesets config:\n${errors.join('\n')}`);
  const changesets = await readChangesets(cwd);
  return getCascadeReleasePlan(changesets, packages, config, await readPreState(cwd));
}

export function getTransitiveDependents(packages: Packages): Map<string, string[]> {
  const baseGraph = getDependentsGraph(packages);
  const transitiveGraph = new Map<string, string[]>();

  const collectAllDependents = (
    pkgName: string,
    allDependents = new Set<string>()
  ): Set<string> => {
    const directDependents = baseGraph.get(pkgName) || [];

    for (const dependent of directDependents) {
      // Avoid infinite loops in case of circular dependencies
      if (!allDependents.has(dependent)) {
        allDependents.add(dependent);
        collectAllDependents(dependent, allDependents);
      }
    }

    return allDependents;
  };

  baseGraph.forEach((_, pkgName) => {
    const allDependents = collectAllDependents(pkgName);
    transitiveGraph.set(pkgName, Array.from(allDependents));
  });

  return transitiveGraph;
}

export async function getChangesetsWithCommits(cwd: string): Promise<NewChangesetWithCommit[]> {
  const changesets = await readChangesets(cwd);
  const ids = changesets.map((chset) => chset.id);
  const paths = ids.map((id) => `.changeset/${id}.md`);
  // will return an array with commit SHA or undefined string if changeset path has no commit
  const commits = await getCommitsThatAddFiles(paths, { cwd });

  // apply found commits to changesets
  return changesets.map((chset, index) => ({
    ...chset,
    commit: commits[index],
  }));
}

export function getPackageChangesetMap(
  changesetsWithCommits: NewChangesetWithCommit[]
): Map<string, PackageChangeset[]> {
  const changesetMap = new Map<string, PackageChangeset[]>();
  changesetsWithCommits.forEach((chset) => {
    const pkgNames = chset.releases.map((release) => release.name);
    pkgNames.forEach((pkgName) => {
      const packageSpecificChangeset = {
        ...chset,
        releaseType: chset.releases.find((r) => r.name === pkgName)!.type,
      };
      changesetMap.get(pkgName)?.push(packageSpecificChangeset) ||
        changesetMap.set(pkgName, [packageSpecificChangeset]);
    });
  });
  return changesetMap;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const isSnapshot = process.argv.includes('--snapshot');
  const cwd = process.cwd();

  console.log('📦 Custom changeset cascade version script: start...');
  const packages = await getPackages(cwd);
  const config = (await readConfig(cwd, packages))?.config;
  if (!config) {
    throw new Error('Failed to read changesets config (.changeset/config.json).');
  }
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - Forcing no git commit to be made');
    config.commit = false;
  }

  const preState = await readPreState(cwd);
  if (isSnapshot && preState?.mode === 'pre') {
    throw new Error('Snapshot release is not allowed in pre mode. Run `changeset pre exit` first.');
  }

  const originalChangesets = await getChangesetsWithCommits(cwd);

  if (originalChangesets.length === 0) {
    console.log('No pending changesets found.');
    if (isSnapshot && !dryRun) {
      writeGithubOutput('snapshot_publish', 'false');
    }
    return;
  }

  const snapshotParams =
    isSnapshot && config.snapshot.prereleaseTemplate?.includes('{commit}')
      ? { tag: canaryTag, commit: await getCurrentCommitId({ cwd }) }
      : isSnapshot
      ? { tag: canaryTag }
      : undefined;

  const releasePlan = getCascadeReleasePlan(
    originalChangesets,
    packages,
    config,
    preState,
    snapshotParams
  );

  console.log('\n📋 Final release plan:');
  releasePlan.releases
    .filter((r) => r.type !== 'none')
    .forEach((r) => {
      console.log(`  ${r.name}: ${r.oldVersion} → ${r.newVersion} (${r.type})`);
    });

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - skipping applyReleasePlan (no files changed)');
    return;
  }

  const applyConfig = isSnapshot ? { ...config, changelog: false as const } : config;
  await applyReleasePlan(releasePlan, packages, applyConfig, isSnapshot ? canaryTag : undefined);

  if (isSnapshot) {
    writeGithubOutput('snapshot_publish', 'true');
  }

  console.log('✅ Version updates applied with cascading bumps.');
}

runMain(import.meta.url, main);
