import { expect } from 'chai';
import proxyquire from 'proxyquire';

const loadGetVersions = (packageJson: object) => {
  const mod = proxyquire('./versions', {
    fs: {
      readFileSync: () => JSON.stringify(packageJson),
    },
  });
  return mod.getVersions as () => { [key: string]: string };
};

describe('angular-templates getVersions', () => {
  it('should return only content sdk package versions for a stable release', () => {
    const getVersions = loadGetVersions({
      version: '1.0.0',
      devDependencies: {
        '@sitecore-content-sdk/angular': '~1.0.0',
        '@sitecore-content-sdk/cli': '^2.3.0',
        '@types/node': '^24.10.4',
        typescript: '~5.8.3',
      },
    });

    expect(getVersions()).to.deep.equal({
      '@sitecore-content-sdk/angular': '~1.0.0',
      '@sitecore-content-sdk/cli': '^2.3.0',
    });
  });

  it('should strip range prefixes from pre-release deps when the package is pre-release', () => {
    const getVersions = loadGetVersions({
      version: '1.0.0-canary.4',
      devDependencies: {
        '@sitecore-content-sdk/angular': '~1.0.0-canary.0',
        '@sitecore-content-sdk/cli': '~2.3.1-beta.2',
      },
    });

    expect(getVersions()).to.deep.equal({
      '@sitecore-content-sdk/angular': '1.0.0-canary.0',
      '@sitecore-content-sdk/cli': '2.3.1-beta.2',
    });
  });
});
