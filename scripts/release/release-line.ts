/**
 * Release lines: what a branch publishes and how. The single source for branch-type decisions,
 * used by the release scripts and by `publish.yml` (both jobs read it through the CLI).
 *
 * Usage: tsx ./scripts/release/release-line.ts [branch]
 * Writes `npm_tag`, `pr_title`, `canary_prefix` and `side_line` for the branch (default:
 * GITHUB_REF_NAME) to GITHUB_OUTPUT, or prints them when it isn't set.
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { appendFileSync } from 'fs';
import { runMain } from '../changesets/utils';

export const MAIN_BRANCH = 'dev';

export type ReleaseLineType = 'full' | 'limited' | 'hotfix' | 'legacy' | 'ver1' | 'beta' | 'other';

export interface ReleaseLine {
  type: ReleaseLineType;
  /** npm dist-tag of stable releases. */
  npmTag: string;
  /** npm dist-tag (and version prefix) of canary snapshots. */
  canaryPrefix: string;
  /** Title of the release PR changesets/action opens. */
  prTitle: string;
  /** Stable releases update `release/latest`. */
  syncsLatest: boolean;
  /**
   * Side line publishing to npm `latest` (limited, hotfix): its versions are checked against npm
   * before publishing, and the version bump is cherry-picked back to dev.
   */
  sideLine: boolean;
}

const TITLE = '[csdk][release]';

export function releaseLine(branch: string): ReleaseLine {
  const line = (type: ReleaseLineType, overrides: Partial<ReleaseLine>): ReleaseLine => ({
    type,
    npmTag: 'latest',
    canaryPrefix: 'canary',
    prTitle: `${TITLE} Release - ${branch}`,
    syncsLatest: false,
    sideLine: false,
    ...overrides,
  });
  const side = { syncsLatest: true, sideLine: true };

  if (branch === MAIN_BRANCH) {
    return line('full', { prTitle: `${TITLE} Full release`, syncsLatest: true });
  }
  if (branch.startsWith('release/limited/')) {
    return line('limited', {
      ...side,
      canaryPrefix: 'canary-prerelease',
      prTitle: `${TITLE} Limited release - ${branch}`,
    });
  }
  if (branch.startsWith('release/hotfix/')) {
    return line('hotfix', {
      ...side,
      canaryPrefix: 'canary-hotfix',
      prTitle: `${TITLE} Hotfix / feature release - ${branch}`,
    });
  }
  if (branch.startsWith('release/legacy/')) {
    return line('legacy', {
      npmTag: 'legacy',
      canaryPrefix: 'canary-legacy',
      prTitle: `${TITLE} Legacy release - ${branch}`,
    });
  }
  if (branch === 'release/1.x.x') {
    // canaries share dev's canary tag (follow-up)
    return line('ver1', { npmTag: 'ver1', prTitle: `${TITLE} Legacy release (ver1) - ${branch}` });
  }
  if (branch.startsWith('release/betas/')) {
    // betas publish canaries only (publish.yml skips their stable job)
    const suffix = branch.slice('release/betas/'.length).replace(/\//g, '-');
    return line('beta', { canaryPrefix: `beta.${suffix}` });
  }
  return line('other', {});
}

async function main(): Promise<void> {
  const branch = process.argv[2] || process.env.GITHUB_REF_NAME;
  if (!branch) throw new Error('Pass a branch or set GITHUB_REF_NAME.');
  const line = releaseLine(branch);
  const output = [
    `npm_tag=${line.npmTag}`,
    `pr_title=${line.prTitle}`,
    `canary_prefix=${line.canaryPrefix}`,
    `side_line=${line.sideLine}`,
  ].join('\n');
  console.log(`${branch}: ${line.type} release line\n${output}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${output}\n`);
}

runMain(import.meta.url, main);
