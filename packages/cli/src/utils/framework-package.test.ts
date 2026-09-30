/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { resolveContentSdkPackageNames } from './framework-package';

describe('resolveContentSdkPackageNames', () => {
  const appPath = '/app';

  const stubPackageJson = (contents: string) => {
    sinon.stub(fs, 'existsSync').returns(true);
    sinon.stub(fs, 'readFileSync').returns(contents);
  };

  afterEach(() => {
    sinon.restore();
  });

  it('should return undefined when the folder has no package.json', () => {
    sinon.stub(fs, 'existsSync').returns(false);

    expect(resolveContentSdkPackageNames(appPath)).to.be.undefined;
    expect((fs.existsSync as sinon.SinonStub).calledWith(path.resolve(appPath, 'package.json'))).to
      .be.true;
  });

  it('should return undefined when package.json cannot be parsed', () => {
    stubPackageJson('not json');

    expect(resolveContentSdkPackageNames(appPath)).to.be.undefined;
  });

  it('should return an empty list when no Content SDK package is referenced', () => {
    stubPackageJson(JSON.stringify({ dependencies: { next: '^16.2.0' } }));

    expect(resolveContentSdkPackageNames(appPath)).to.deep.equal([]);
  });

  it('should return the Content SDK package from dependencies', () => {
    stubPackageJson(JSON.stringify({ dependencies: { '@sitecore-content-sdk/nextjs': '^2.4.0' } }));

    expect(resolveContentSdkPackageNames(appPath)).to.deep.equal(['@sitecore-content-sdk/nextjs']);
  });

  it('should return the Content SDK package from devDependencies', () => {
    stubPackageJson(
      JSON.stringify({ devDependencies: { '@sitecore-content-sdk/angular': '^1.0.0' } })
    );

    expect(resolveContentSdkPackageNames(appPath)).to.deep.equal(['@sitecore-content-sdk/angular']);
  });

  it('should return every Content SDK package the app depends on', () => {
    stubPackageJson(
      JSON.stringify({
        dependencies: {
          '@sitecore-content-sdk/nextjs': '^2.4.0',
          '@sitecore-content-sdk/events': '^2.1.0',
          next: '^16.2.0',
        },
        devDependencies: {
          '@sitecore-content-sdk/cli': '^2.3.0',
        },
      })
    );

    expect(resolveContentSdkPackageNames(appPath)).to.deep.equal([
      '@sitecore-content-sdk/cli',
      '@sitecore-content-sdk/events',
      '@sitecore-content-sdk/nextjs',
    ]);
  });

  it('should default to the current working directory', () => {
    stubPackageJson(JSON.stringify({ dependencies: { '@sitecore-content-sdk/nextjs': '^2.4.0' } }));

    expect(resolveContentSdkPackageNames()).to.deep.equal(['@sitecore-content-sdk/nextjs']);
    expect(
      (fs.existsSync as sinon.SinonStub).calledWith(path.resolve(process.cwd(), 'package.json'))
    ).to.be.true;
  });
});
