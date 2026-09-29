/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { resolveFrameworkPackageName } from './framework-package';

describe('resolveFrameworkPackageName', () => {
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

    expect(resolveFrameworkPackageName(appPath)).to.be.undefined;
    expect((fs.existsSync as sinon.SinonStub).calledWith(path.resolve(appPath, 'package.json'))).to
      .be.true;
  });

  it('should return undefined when package.json cannot be parsed', () => {
    stubPackageJson('not json');

    expect(resolveFrameworkPackageName(appPath)).to.be.undefined;
  });

  it('should return undefined when no framework package is referenced', () => {
    stubPackageJson(JSON.stringify({ dependencies: { next: '^16.2.0' } }));

    expect(resolveFrameworkPackageName(appPath)).to.be.undefined;
  });

  it('should return the framework package from dependencies', () => {
    stubPackageJson(JSON.stringify({ dependencies: { '@sitecore-content-sdk/nextjs': '^2.4.0' } }));

    expect(resolveFrameworkPackageName(appPath)).to.equal('@sitecore-content-sdk/nextjs');
  });

  it('should return the framework package from devDependencies', () => {
    stubPackageJson(
      JSON.stringify({ devDependencies: { '@sitecore-content-sdk/angular': '^1.0.0' } })
    );

    expect(resolveFrameworkPackageName(appPath)).to.equal('@sitecore-content-sdk/angular');
  });

  it('should default to the current working directory', () => {
    stubPackageJson(JSON.stringify({ dependencies: { '@sitecore-content-sdk/nextjs': '^2.4.0' } }));

    expect(resolveFrameworkPackageName()).to.equal('@sitecore-content-sdk/nextjs');
    expect(
      (fs.existsSync as sinon.SinonStub).calledWith(path.resolve(process.cwd(), 'package.json'))
    ).to.be.true;
  });
});
