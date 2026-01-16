import type { ChangelogFunctions, NewChangesetWithCommit } from '@changesets/types';

/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

const REPO = 'sitecore/content-sdk';

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

  // Format the entry with package prefix and commit link
  let entry = `- ${firstLine}${commitLink}`;

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
