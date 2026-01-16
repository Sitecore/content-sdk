/**
 * Integrated cascade version script using changesets programmatic API
 *
 * Original `changeset version` command does not support cascading version bumps
 * This script replaces `changeset version` with a custom implementation that:
 * 1. Reads pending changesets
 * 2. Cascades major/minor/patch bumps from ANY package to all its dependents
 * 3. Assembles a new release plan with synthetic changesets
 * 4. Applies the modified release plan
 *
 * Cascading rules:
 * - If package A has a version bump (patch/minor/major),
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
import { getPackages } from '@manypkg/get-packages';
import { getDependentsGraph } from '@changesets/get-dependents-graph';
import type { VersionType, NewChangesetWithCommit, NewChangeset } from '@changesets/types';

const REPO = 'sitecore/content-sdk';
// Bump type priority (higher = more significant)
const BUMP_PRIORITY: Record<VersionType | 'none', number> = {
  major: 3,
  minor: 2,
  patch: 1,
  none: 0,
};

interface BumpInfo {
  type: VersionType;
  sourcePkg: string;
  summary: string;
  commit?: string;
}

type DependentsGraph = Map<string, string[]>;

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
  // Use custom reader to avoid reading from .changeset/scripts/ subdirectory
  const changesets = await getChangesets(cwd);

  if (changesets.length === 0) {
    console.log('No pending changesets found.');
    return;
  }

  // Build dependents graph
  const dependentsGraph = getDependentsGraph(packages) as DependentsGraph;

  // Collect all pending version bumps from minor/major changesets
  const pendingBumps = new Map<string, BumpInfo[]>();
  changesets.forEach((changeset) => {
    changeset.releases.forEach((pendingRelease) => {
      const isMinorOrMajor = BUMP_PRIORITY[pendingRelease.type] >= BUMP_PRIORITY.minor;
      if (isMinorOrMajor) {
        if (!pendingBumps.has(pendingRelease.name)) {
          pendingBumps.set(pendingRelease.name, []);
        }
        pendingBumps.get(pendingRelease.name)!.push({
          type: pendingRelease.type,
          sourcePkg: pendingRelease.name,
          summary: changeset.summary,
          commit: changeset.commit,
        });
      }
    });
  });

  // Propagate bumps through dependency graph
  const extraBumps = addCascadedBumps(pendingBumps, dependentsGraph);

  // Determine which packages need synthetic changesets (cascade bumps)
  const syntheticChangesets = generateSynteticChangesets(extraBumps);

  if (syntheticChangesets.length === 0) {
    console.log(
      'All dependent packages already have appropriate changesets, no extra bumps added.'
    );
  }

  // Combine original and synthetic changesets
  const allChangesets = [...changesets, ...syntheticChangesets];

  // Assemble release plan with all changesets
  const releasePlan = assembleReleasePlan(allChangesets, packages, config, undefined);

  console.log('\n📋 Final release plan:');
  releasePlan.releases
    .filter((r) => r.type !== 'none')
    .forEach((r) => {
      console.log(`  ${r.name}: ${r.oldVersion} → ${r.newVersion} (${r.type})`);
    });

  await applyReleasePlan(releasePlan, packages, config);

  console.log('✅ Version updates applied with cascading bumps.');
}

/**
 * Read changesets with associated commits
 */
async function getChangesets(cwd: string): Promise<NewChangesetWithCommit[]> {
  const changesets = await readChangesets(cwd);
  const ids = changesets.map((chset) => chset.id);
  const paths = ids.map((id) => `.changeset/${id}.md`);
  // will return an array with commit SHA or undefined string if changeset path has no commit
  const commits = await getCommitsThatAddFiles(paths, { cwd });
  return changesets.map((chset, index) => ({ ...chset, commit: commits[index] }));
}

/**
 * Generate a random changeset ID
 */
function generateChangesetId(): string {
  const random = crypto.randomUUID();
  return `${'cascade-changeset-' + random}`;
}

/**
 * Propagate bumps through the dependency graph
 * Collects all bumps that need to cascade to dependents
 */
function addCascadedBumps(
  originalBumps: Map<string, BumpInfo[]>,
  dependentsGraph: DependentsGraph
): Map<string, BumpInfo[]> {
  const extraBumps = new Map<string, BumpInfo[]>();

  // Propagate each bump from each package to all its dependents
  originalBumps.forEach((bumps, pkg) => {
    const dependents = getAllDependents(pkg, dependentsGraph);

    bumps.forEach((bumpInfo) => {
      dependents.forEach((depPkg) => {
        // Skip if dependent is the source package itself
        if (depPkg === pkg) return;

        if (!extraBumps.has(depPkg)) {
          extraBumps.set(depPkg, []);
        }

        extraBumps.get(depPkg)!.push({
          type: bumpInfo.type,
          sourcePkg: pkg,
          summary: bumpInfo.summary,
          commit: bumpInfo.commit,
        });
      });
    });
  });

  return extraBumps;
}

/**
 * Get all dependents (direct and transitive) for a package using BFS
 */
function getAllDependents(pkg: string, dependentsGraph: DependentsGraph): Set<string> {
  const allDependents = new Set<string>();
  const queue = [pkg];
  const visited = new Set<string>([pkg]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const directDependents = dependentsGraph.get(current) || [];

    for (const dep of directDependents) {
      if (!visited.has(dep)) {
        visited.add(dep);
        allDependents.add(dep);
        queue.push(dep);
      }
    }
  }

  return allDependents;
}

/**
 * Generate synthetic changesets for cascaded bumps
 * Groups by dependent package -> source package -> bump type
 */
function generateSynteticChangesets(extraBumps: Map<string, BumpInfo[]>): NewChangeset[] {
  const syntheticChangesets: NewChangeset[] = [];

  // Group extraBumps by: dependentPkg -> sourcePkg -> bumpType -> BumpInfo[]
  type GroupedBumps = Map<string, Map<VersionType, BumpInfo[]>>;
  const grouped = new Map<string, GroupedBumps>();

  extraBumps.forEach((bumps, depPkg) => {
    bumps.forEach((bump) => {
      if (!grouped.has(depPkg)) {
        grouped.set(depPkg, new Map());
      }
      const bySource = grouped.get(depPkg)!;

      if (!bySource.has(bump.sourcePkg)) {
        bySource.set(bump.sourcePkg, new Map());
      }
      const byType = bySource.get(bump.sourcePkg)!;

      if (!byType.has(bump.type)) {
        byType.set(bump.type, []);
      }
      byType.get(bump.type)!.push(bump);
    });
  });

  // Generate synthetic changesets
  grouped.forEach((bySource, depPkg) => {
    bySource.forEach((byType, sourcePkg) => {
      byType.forEach((bumps, type) => {
        const shortSourceName = sourcePkg.replace(/^@.+\//, '');
        const changeLines = bumps.map((b) => {
          const shortCommit = b.commit?.substring(0, 7);
          const commitLink = shortCommit
            ? ` ([${shortCommit}](https://github.com/${REPO}/commit/${b.commit}))`
            : '';
          return `  - ${b.summary}${commitLink}`;
        });

        const summary = `${type} \`${shortSourceName}\` dependency update:\n${changeLines.join('\n')}`;

        syntheticChangesets.push({
          id: generateChangesetId(),
          summary,
          releases: [{ name: depPkg, type }],
        });

        console.log(
          `  🔄 ${depPkg}: ${type} (from ${shortSourceName}, ${bumps.length} change(s))`
        );
      });
    });
  });

  return syntheticChangesets;
}

try {
  main();
} catch (error: any) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
