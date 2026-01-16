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
 * - If package A has a version bump (minor/major),
 * the version bump is propagated to all packages that depend on A (directly or transitively).
 *
 * Usage: tsx .changeset/scripts/cascade-version.ts [--dry-run]
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import assembleReleasePlan from '@changesets/assemble-release-plan';
import applyReleasePlan from '@changesets/apply-release-plan';
import readChangesets from '@changesets/read';
import { getCommitsThatAddFiles } from '@changesets/git';
import { read as readConfig } from '@changesets/config';
import { getPackages, Packages } from '@manypkg/get-packages';
import { getDependentsGraph } from '@changesets/get-dependents-graph';
import type { VersionType, NewChangesetWithCommit, NewChangeset } from '@changesets/types';

const REPO = 'sitecore/content-sdk';

type PackageChangeset = NewChangesetWithCommit & {
  releaseType: VersionType;
};

/**
 * Main script entry point
 */
async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const cwd = process.cwd();

  console.log('📦 Custom changeset cascade version script: start...');
  // Read all necessary data
  const packages = await getPackages(cwd);
  const config = await readConfig(cwd, packages);
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - Forcing no git commit to be made');
    config.commit = false;
  }

  const originalChangesets = await getChangesetsWithCommits(cwd);

  if (originalChangesets.length === 0) {
    console.log('No pending changesets found.');
    return;
  }

  // get per-package changesets for easier processing
  const changesetMap = getPackageChangesetMap(originalChangesets);

  // package -> direct dependent packages graph/map
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
    const aggregatedSummaries = {
      major: [] as string[],
      minor: [] as string[],
    };
    sourceChangesets.forEach((sourceChange) => {
      if (sourceChange.releaseType === 'major') {
        aggregatedSummaries.major.push(formatSummary(sourceChange));
      } else if (sourceChange.releaseType === 'minor') {
        aggregatedSummaries.minor.push(formatSummary(sourceChange));
      }
    });
    dependentPkgs.forEach((depPkg) => {
      // Propagate changes from source to dependent packages if present
      Object.keys(aggregatedSummaries).forEach((changeType) => {
        if (aggregatedSummaries[changeType as keyof typeof aggregatedSummaries].length === 0)
          return;
        const synthethicChange: PackageChangeset = {
          id: generateChangesetId(),
          summary: `${changeType} \`${sourcePkg}\` dependency update:\n${aggregatedSummaries[
            changeType as keyof typeof aggregatedSummaries
          ].join('\n')}`,
          releases: [{ name: depPkg, type: changeType as VersionType }],
          releaseType: changeType as VersionType,
        };
        cascadeChangesets.push(synthethicChange);
      });
    });
  });

  const finalChangesets = [...originalChangesets, ...cascadeChangesets];

  // Assemble release plan with all changesets
  const releasePlan = assembleReleasePlan(finalChangesets, packages, config, undefined);

  console.log('\n📋 Final release plan:');
  releasePlan.releases
    .filter((r) => r.type !== 'none')
    .forEach((r) => {
      console.log(`  ${r.name}: ${r.oldVersion} → ${r.newVersion} (${r.type})`);
    });

  await applyReleasePlan(releasePlan, packages, config);

  console.log('✅ Version updates applied with cascading bumps.');
}

function getTransitiveDependents(packages: Packages): Map<string, string[]> {
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

async function getChangesetsWithCommits(cwd: string): Promise<NewChangesetWithCommit[]> {
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

function getPackageChangesetMap(
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

try {
  main();
} catch (error: any) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
