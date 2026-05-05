import { describe, it, expect } from 'vitest';
import type { NewChangesetWithCommit } from '@changesets/types';
import changelogFunctions from './changelog';

describe('changelog', () => {
  it('should render the first line as a bullet with a GitHub commit link when changeset.commit is present', async () => {
    const changeset: NewChangesetWithCommit = {
      id: 'abc',
      summary: 'Fix the thing',
      releases: [{ name: '@sitecore-content-sdk/core', type: 'patch' }],
      commit: 'deadbeef1234567890abcdef1234567890abcd',
    };
    const line = await changelogFunctions.getReleaseLine(changeset);
    expect(line).toBe(
      '- Fix the thing ([deadbee](https://github.com/sitecore/content-sdk/commit/deadbeef1234567890abcdef1234567890abcd))'
    );
  });

  it('should omit the commit link from the release line when changeset doesnt have a commit', async () => {
    const changeset: NewChangesetWithCommit = {
      id: 'abc',
      summary: 'Solo',
      releases: [{ name: '@sitecore-content-sdk/cli', type: 'minor' }],
    };
    const line = await changelogFunctions.getReleaseLine(changeset);
    expect(line).toBe('- Solo');
  });

  it('should not emit dependency release lines', async () => {
    expect(await changelogFunctions.getDependencyReleaseLine()).toBe('');
  });
});
