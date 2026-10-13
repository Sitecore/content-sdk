/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { npmResolvedSdkDeps } from './refresh-legacy-deps';

const NEXTJS = '@sitecore-content-sdk/nextjs';
const REACT = '@sitecore-content-sdk/react';

describe('npmResolvedSdkDeps', () => {
  it('lists Content SDK dependencies that are not workspace packages', () => {
    const packages = [
      {
        packageJson: {
          name: NEXTJS,
          dependencies: {
            '@sitecore-content-sdk/core': '^2.1.4',
            [REACT]: '^2.4.0',
            debug: '^4.4.0',
          },
          devDependencies: { '@sitecore-content-sdk/personalize': '^2.1.0' },
          peerDependencies: { '@sitecore-content-sdk/events': '^2.1.2' },
        },
      },
      {
        packageJson: {
          name: REACT,
          dependencies: {
            '@sitecore-content-sdk/core': '^2.1.4',
            '@sitecore-content-sdk/search': '^0.5.0',
          },
        },
      },
      { packageJson: { name: 'create-content-sdk-app', dependencies: { [NEXTJS]: '^2.4.0' } } },
    ];
    expect(npmResolvedSdkDeps(packages)).toEqual([
      '@sitecore-content-sdk/core',
      '@sitecore-content-sdk/events',
      '@sitecore-content-sdk/personalize',
      '@sitecore-content-sdk/search',
    ]);
  });

  it('returns nothing when every Content SDK dependency is in the workspace', () => {
    expect(
      npmResolvedSdkDeps([
        { packageJson: { name: NEXTJS, dependencies: { [REACT]: '^2.4.0' } } },
        { packageJson: { name: REACT } },
      ])
    ).toEqual([]);
  });
});
