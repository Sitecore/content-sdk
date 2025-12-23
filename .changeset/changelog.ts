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
function getShortPackageName(packageName: string): string {
  if (packageName.startsWith('@sitecore-content-sdk/')) {
    return packageName.replace('@sitecore-content-sdk/', '');
  }
  return packageName;
}

/**
 * Get package prefixes from changeset releases
 * Returns format like "[core]" or "[core, react]" for multiple packages
 */
function getPackagePrefix(changeset: NewChangesetWithCommit): string {
  if (!changeset.releases || changeset.releases.length === 0) {
    return '';
  }

  const shortNames = changeset.releases.map((r) => getShortPackageName(r.name));
  return `[${shortNames.join(', ')}]`;
}

/**
 * Custom changelog entry renderer that includes commit links and package prefix
 */
async function getReleaseLine(changeset: NewChangesetWithCommit, _type: string): Promise<string> {
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
 * Custom dependency update renderer
 * Shows the actual change descriptions from dependencies with package prefix
 */
async function getDependencyReleaseLine(
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[]
): Promise<string> {
  if (dependenciesUpdated.length === 0 || changesets.length === 0) {
    return '';
  }

  // Get all the change descriptions from the dependency changesets
  const changeEntries = changesets.map((changeset) => {
    const [firstLine] = changeset.summary.split('\n').map((l) => l.trimEnd());

    let commitLink = '';
    if (changeset.commit) {
      const shortCommit = changeset.commit.substring(0, 7);
      commitLink = ` ([${shortCommit}](https://github.com/${REPO}/commit/${changeset.commit}))`;
    }

    // Get package prefix
    const prefix = getPackagePrefix(changeset);
    const prefixStr = prefix ? `${prefix} ` : '';

    return `- ${prefixStr}${firstLine}${commitLink}`;
  });

  return changeEntries.join('\n');
}

const changelogFunctions: ChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
};

export default changelogFunctions;
