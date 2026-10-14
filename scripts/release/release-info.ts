/**
 * Release info: what a branch publishes and how. The single source for branch-type decisions,
 * used by the release scripts and by `publish.yml` (both jobs read it through the CLI).
 *
 * Usage: tsx ./scripts/release/release-info.ts [branch]
 * Writes `npm_tag`, `pr_title` and `canary_prefix` for the branch (default:
 * GITHUB_REF_NAME) to GITHUB_OUTPUT, or prints them when it isn't set.
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { appendFileSync } from 'fs';
import { runMain } from '../changesets/utils.ts';
import { MAIN_BRANCH } from '../constants.ts';
import { branchPrefix } from './utils.ts';

export type ReleaseType = 'full' | 'limited' | 'hotfix' | 'legacy' | 'ver1' | 'beta';

export interface ReleaseInfo {
  type: ReleaseType;
  /** npm dist-tag of stable releases. */
  npmTag: string;
  /** npm dist-tag (and version prefix) of canary snapshots; `<suffix>`: the branch after its prefix. */
  canaryPrefix: string;
  /** Title of the release PR changesets/action opens; `<branch>`: the branch. */
  prTitle: string;
}

const TITLE = '[csdk][release]';

/** Release info by branch prefix (`branchPrefix`): `dev`, or `release/<name>`. */
const RELEASE_INFOS = new Map<string, ReleaseInfo>([
  [
    MAIN_BRANCH,
    { type: 'full', npmTag: 'latest', canaryPrefix: 'canary', prTitle: `${TITLE} Full release` },
  ],
  [
    'release/limited',
    {
      type: 'limited',
      npmTag: 'latest',
      canaryPrefix: 'canary-prerelease',
      prTitle: `${TITLE} Limited release - <branch>`,
    },
  ],
  [
    'release/hotfix',
    {
      type: 'hotfix',
      npmTag: 'latest',
      canaryPrefix: 'canary-hotfix',
      prTitle: `${TITLE} Hotfix / feature release - <branch>`,
    },
  ],
  [
    'release/legacy',
    {
      type: 'legacy',
      npmTag: 'legacy',
      canaryPrefix: 'canary-legacy',
      prTitle: `${TITLE} Legacy release - <branch>`,
    },
  ],
  [
    'release/1.x.x',
    {
      type: 'ver1',
      npmTag: 'ver1',
      canaryPrefix: 'ver1-canary',
      prTitle: `${TITLE} Legacy release (ver1) - <branch>`,
    },
  ],
  [
    'release/betas',
    // betas publish canaries only (publish.yml skips their stable job)
    {
      type: 'beta',
      npmTag: 'latest',
      canaryPrefix: 'beta.<suffix>',
      prTitle: `${TITLE} Release - <branch>`,
    },
  ],
]);

/**
 * Release info of a branch (what it publishes and how), resolved by its prefix. Throws for any
 * branch not in `RELEASE_INFOS`: unlisted release branches publish nothing (`publish.yml` doesn't
 * trigger on them either).
 */
export function getReleaseInfo(branch: string): ReleaseInfo {
  const prefix = branchPrefix(branch);
  const suffix = branch.slice(prefix.length + 1).replace(/\//g, '-');
  const info = RELEASE_INFOS.get(prefix);
  if (!info) {
    throw new Error(
      `${branch} is not a release branch (${[...RELEASE_INFOS.keys()].join(
        ', '
      )}); nothing to publish.`
    );
  }
  return {
    ...info,
    canaryPrefix: info.canaryPrefix.replace('<suffix>', suffix),
    prTitle: info.prTitle.replace('<branch>', branch),
  };
}

async function main(): Promise<void> {
  const branch = process.argv[2] || process.env.GITHUB_REF_NAME;
  if (!branch) throw new Error('Pass a branch or set GITHUB_REF_NAME.');
  const info = getReleaseInfo(branch);
  const output = [
    `npm_tag=${info.npmTag}`,
    `pr_title=${info.prTitle}`,
    `canary_prefix=${info.canaryPrefix}`,
  ].join('\n');
  console.log(`${branch} release info (${info.type}):\n${output}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${output}\n`);
}

runMain(import.meta.url, main);
