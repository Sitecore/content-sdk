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
import type { VersionType, NewChangesetWithCommit } from '@changesets/types';

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

  // Collect initial bumps from all changesets (highest priority per package)
  const initialBumps = new Map<string, BumpInfo>();
  changesets.forEach((changeset) => {
    changeset.releases.forEach((release) => {
      const existing = initialBumps.get(release.name);
      if (!existing || BUMP_PRIORITY[release.type] > BUMP_PRIORITY[existing.type]) {
        initialBumps.set(release.name, {
          type: release.type,
          sourcePkg: release.name,
          summary: changeset.summary,
          commit: changeset.commit,
        });
      }
    });
  });

  // Propagate bumps through dependency graph
  const extraBumps = getPropagatedBumps(initialBumps, dependentsGraph);

  // Determine which packages need synthetic changesets (cascade bumps)
  const syntheticChangesets = generateSynteticChangesets(initialBumps, extraBumps);

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
 * Uses iterative approach to handle transitive dependencies correctly
 */
function getPropagatedBumps(
  originalBumps: Map<string, BumpInfo>,
  dependentsGraph: DependentsGraph
): Map<string, BumpInfo> {
  // Map of package -> { type, source } for final bump decisions
  const extraBumps = new Map<string, BumpInfo>();

  // Combined map of all bumps (original + extra) for propagation
  const allBumps = new Map<string, BumpInfo>(originalBumps);

  // Keep propagating until no more changes to add
  let changed = true;
  while (changed) {
    changed = false;

    // Iterate over ALL bumps (original + newly added extras)
    allBumps.forEach((bumpInfo, pkg) => {
      const dependents = dependentsGraph.get(pkg) || [];

      dependents.forEach((depPkg) => {
        const existingExtra = extraBumps.get(depPkg);
        const existingOriginal = originalBumps.get(depPkg);

        // If dependent doesn't have a bump, or has a lower priority bump, upgrade it
        const currentPriority = Math.max(
          BUMP_PRIORITY[existingExtra?.type || 'none'],
          BUMP_PRIORITY[existingOriginal?.type || 'none']
        );

        if (BUMP_PRIORITY[bumpInfo.type] > currentPriority) {
          const newBumpInfo: BumpInfo = {
            type: bumpInfo.type,
            sourcePkg: pkg,
            // use only the short package name in the summary
            summary: `[${pkg.replace(/^@.+\//, '')}] ${bumpInfo.summary}`,
            commit: bumpInfo.commit,
          };
          extraBumps.set(depPkg, newBumpInfo);
          allBumps.set(depPkg, newBumpInfo); // Add to allBumps so it can propagate further
          changed = true;
        }
      });
    });
  }

  return extraBumps;
}

/**
 * Generate synthetic changesets for cascaded bumps
 */
function generateSynteticChangesets(
  initialBumps: Map<string, BumpInfo>,
  extraBumps: Map<string, BumpInfo>
): NewChangesetWithCommit[] {
  const syntheticChangesets: NewChangesetWithCommit[] = [];
  extraBumps.forEach((info, pkgName) => {
    const originalBump = initialBumps.get(pkgName);

    // Create synthetic changeset if:
    // 1. Package didn't have an original changeset, OR
    // 2. The cascaded bump is higher priority than the original
    if (!originalBump || BUMP_PRIORITY[info.type] > BUMP_PRIORITY[originalBump.type]) {
      // syntetic changeset's commit will be ignored by changesets, so we add it to summary
      const shortCommit = info.commit?.substring(0, 7);
      const commitLink = shortCommit
        ? ` ([${shortCommit}](https://github.com/${REPO}/commit/${info.commit}))`
        : '';
      const syntheticChangeset: NewChangesetWithCommit = {
        id: generateChangesetId(),
        summary: `${info.summary} ${commitLink}`,
        releases: [{ name: pkgName, type: info.type }],
      };
      syntheticChangesets.push(syntheticChangeset);
      console.log(
        `  🔄 ${pkgName}: ${originalBump?.type || 'none'} → ${info.type} (from ${info.sourcePkg})`
      );
    }
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
