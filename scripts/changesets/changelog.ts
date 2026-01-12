import type {
  ChangelogFunctions,
  NewChangesetWithCommit,
  ModCompWithPackage,
} from '@changesets/types';

/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

const REPO = 'sitecore/content-sdk';

/**
 * Extract short package name from full package name
 * e.g., "@sitecore-content-sdk/core" -> "core"
 *       "create-content-sdk-app" -> "create-content-sdk-app"
 */
function stripPackageScope(packageName: string): string {
  return packageName.replace(/^@.+\//, '');
}

/**
 * Get package prefixes from changeset releases
 * Returns format like "[core]" or "[core] [react]" for multiple packages
 */
function getPackagePrefix(changeset: NewChangesetWithCommit): string {
  if (!changeset.releases || changeset.releases.length === 0) {
    return '';
  }

  const prefixNames = changeset.releases.map((r) => `[${stripPackageScope(r.name)}]`);
  return prefixNames.join(' ');
}

/**
 * Custom changelog entry renderer that includes commit links and package prefix
 */
async function getReleaseLine(changeset: NewChangesetWithCommit): Promise<string> {
  const [firstLine, ...remainingLines] = changeset.summary.split('\n').map((l) => l.trimEnd());

  let commitLink = '';
  if (changeset.commit) {
    const shortCommit = changeset.commit.substring(0, 7);
    commitLink = ` ([${shortCommit}](https://github.com/${REPO}/commit/${changeset.commit}))`;
  }

  // Get package prefix
  const prefix = getPackagePrefix(changeset);
  const prefixStr = prefix ? `${prefix} ` : '';

  // Format the entry with package prefix and commit link
  let entry = `- ${prefixStr}${firstLine}${commitLink}`;

  // Add remaining lines with proper indentation
  if (remainingLines.length > 0) {
    const formattedRemainingLines = remainingLines.map((l) => `  ${l}`).join('\n');
    entry += `\n${formattedRemainingLines}`;
  }

  return entry;
}

/**
 * Return empty string for dependency release line as dependency are
 * processed by cascade versioning script
 */
async function getDependencyReleaseLine(): Promise<string> {
  return '';
}

const changelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
};

export default changelogFunctions;
