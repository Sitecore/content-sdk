import { expect } from 'chai';
import { collectSdkPackageVersions } from './versions';

describe('collectSdkPackageVersions', () => {
  it('keeps sitecore package versions as snake_case keys', () => {
    const versions = collectSdkPackageVersions({
      dependencies: {
        '@sitecore-content-sdk/nextjs': '^2.4.1',
        react: '^19.0.0',
      },
      devDependencies: {
        '@sitecore-content-sdk/core': '~2.1.4',
      },
    });

    expect(versions).to.deep.equal({
      nextjs_version: '^2.4.1',
      core_version: '~2.1.4',
    });
  });

  it('leaves out versions that are not a version or a simple range', () => {
    const versions = collectSdkPackageVersions({
      dependencies: {
        '@sitecore-content-sdk/nextjs': 'latest',
        '@sitecore-content-sdk/core': 'file:../core',
      },
    });

    expect(versions).to.deep.equal({});
  });
});
