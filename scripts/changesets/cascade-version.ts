/**
 * Integrated cascade version script using changesets programmatic API
 *
 * Original `changeset version` command does not support cascading version bumps
 * This script replaces `changeset version` with a custom implementation that:
 * 1. Reads pending changesets
 * 2. Cascades major/minor bumps from ANY package to all its dependents
 * 3. Assembles a new release plan with cascade changesets
 * 4. Applies the modified release plan
 *
 * Cascading rules:
 * - If package A has a version bump (minor/major; or any bump when --snapshot),
 * the version bump is propagated to all packages that depend on A (directly or transitively).
 *
 * With --snapshot: all change types cascade; snapshot semver suffixes are applied via changesets;
 * changelogs are not updated (CI-only; changesets are not removed from the remote branch).
 *
 * Usage: tsx ./scripts/changesets/cascade-version.ts [--dry-run] [--snapshot]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { appendFileSync } from 'fs';
import assembleReleasePlan from '@changesets/assemble-release-plan';
import applyReleasePlan from '@changesets/apply-release-plan';
import readChangesets from '@changesets/read';
import { getCommitsThatAddFiles, getCurrentCommitId } from '@changesets/git';
import { read as readConfig } from '@changesets/config';
import { readPreState } from '@changesets/pre';
import { getPackages, Packages } from '@manypkg/get-packages';
import { getDependentsGraph } from '@changesets/get-dependents-graph';
import type { VersionType, NewChangesetWithCommit, NewChangeset } from '@changesets/types';

const REPO = 'sitecore/content-sdk';

// List of packages that will get patch bumps instead of minor/major via cascade versioning
const cascadeVersionPatchOnlyPkgs = ['create-content-sdk-app'];

type PackageChangeset = NewChangesetWithCommit & {
  releaseType: VersionType;
};

function writeGithubOutput(key: string, value: string): void {
  const out = process.env.GITHUB_OUTPUT;
  if (!out) return;
  appendFileSync(out, `${key}=${value}\n`);
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const isSnapshot = process.argv.includes('--snapshot');
  const cwd = process.cwd();

  console.log('📦 Custom changeset cascade version script: start...');
  // Read all necessary data
  const packages = await getPackages(cwd);
  const config = await readConfig(cwd, packages);
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

  // get per-package changesets for easier processing
  const changesetMap = getPackageChangesetMap(originalChangesets);

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

  const cascadeChangeTypes: VersionType[] = isSnapshot
    ? ['major', 'minor', 'patch']
    : ['major', 'minor'];

  // Apply additional changesets to dependent packages
  const cascadeChangesets = [] as NewChangeset[];
  dependentsGraph.forEach((dependentPkgs, sourcePkg) => {
    const sourceChangesets = changesetMap.get(sourcePkg);
    if (!sourceChangesets) return;

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

  const finalChangesets = [...originalChangesets, ...cascadeChangesets];

  const snapshotParams =
    isSnapshot && config.snapshot.prereleaseTemplate?.includes('{commit}')
      ? { tag: 'beta.atoms' as const, commit: await getCurrentCommitId({ cwd }) }
      : isSnapshot
      ? { tag: 'beta.atoms' as const }
      : undefined;

  const releasePlan = assembleReleasePlan(
    finalChangesets,
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
  await applyReleasePlan(releasePlan, packages, applyConfig, isSnapshot ? 'beta.atoms' : undefined);

  if (isSnapshot) {
    writeGithubOutput('snapshot_publish', 'true');
  }

  console.log('✅ Version updates applied with cascading bumps.');
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

main().catch((error: unknown) => {
  const err = error as Error;
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});

