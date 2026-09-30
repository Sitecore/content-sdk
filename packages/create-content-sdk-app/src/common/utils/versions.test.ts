import { expect } from 'chai';
import proxyquire from 'proxyquire';

const loadGetVersions = (packageJson: object) => {
  const mod = proxyquire('./versions', {
    fs: {
      readFileSync: () => JSON.stringify(packageJson),
    },
  });
  return mod.getVersions as (packageDir: string) => { [key: string]: string };
};

describe('getVersions', () => {
  it('should return only content sdk package versions for a stable release', () => {
    const getVersions = loadGetVersions({
      version: '2.4.0',
      devDependencies: {
        '@sitecore-content-sdk/nextjs': '^2.4.0',
        '@sitecore-content-sdk/cli': '^2.3.0',
        '@types/node': '^24.10.4',
        typescript: '~5.8.3',
      },
    });

    expect(getVersions('/pkg')).to.deep.equal({
      '@sitecore-content-sdk/nextjs': '^2.4.0',
      '@sitecore-content-sdk/cli': '^2.3.0',
    });
  });

  it('should preserve prefixes for dependency versions', () => {
    const getVersions = loadGetVersions({
      version: '2.4.0',
      devDependencies: {
        '@sitecore-content-sdk/nextjs': '^2.4.0',
        '@sitecore-content-sdk/events': '~2.1.2',
      },
    });

    expect(getVersions('/pkg')).to.deep.equal({
      '@sitecore-content-sdk/nextjs': '^2.4.0',
      '@sitecore-content-sdk/events': '~2.1.2',
    });
  });
});

