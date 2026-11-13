/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { resolveContentSdkPackageNames } from './framework-packages';

type FrameworkPackagesModule = typeof import('./framework-packages');

describe('framework packages', () => {
  const appPath = '/app';

  const stubPackageJson = (contents: string) => {
    sinon.stub(fs, 'existsSync').returns(true);
    sinon.stub(fs, 'readFileSync').returns(contents);
  };

  const loadWithCreateRequire = (
    createRequireStub: sinon.SinonStub
  ): FrameworkPackagesModule =>
    proxyquire('./framework-packages', {
      module: { createRequire: createRequireStub },
    });

  afterEach(() => sinon.restore());

  describe('resolveContentSdkPackageNames', () => {
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

    it('should return sorted Content SDK dependencies and devDependencies', () => {
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
      stubPackageJson(
        JSON.stringify({ dependencies: { '@sitecore-content-sdk/nextjs': '^2.4.0' } })
      );

      expect(resolveContentSdkPackageNames()).to.deep.equal(['@sitecore-content-sdk/nextjs']);
      expect(
        (fs.existsSync as sinon.SinonStub).calledWith(path.resolve(process.cwd(), 'package.json'))
      ).to.be.true;
    });
  });

  describe('loadAppModule', () => {
    it('should load a module relative to the supplied app path', () => {
      const appRequire = sinon.stub().returns({ catalog: [] });
      const createRequireStub = sinon.stub().returns(appRequire);
      const { loadAppModule } = loadWithCreateRequire(createRequireStub);

      expect(loadAppModule('@sitecore-content-sdk/nextjs/experimental', appPath)).to.deep.equal({
        catalog: [],
      });
      expect(createRequireStub.calledOnceWith(path.resolve(appPath, 'package.json'))).to.be.true;
      expect(appRequire.calledOnceWith('@sitecore-content-sdk/nextjs/experimental')).to.be.true;
    });

    it('should default to the current working directory', () => {
      const appRequire = sinon.stub();
      const createRequireStub = sinon.stub().returns(appRequire);
      const { loadAppModule } = loadWithCreateRequire(createRequireStub);

      loadAppModule('test-module');

      expect(
        createRequireStub.calledOnceWith(path.resolve(process.cwd(), 'package.json'))
      ).to.be.true;
    });
  });

  describe('canResolveAppModule', () => {
    it('should return true when the module can be resolved', () => {
      const resolve = sinon.stub().returns('/app/node_modules/test-module/index.js');
      const createRequireStub = sinon.stub().returns(Object.assign(sinon.stub(), { resolve }));
      const { canResolveAppModule } = loadWithCreateRequire(createRequireStub);

      expect(canResolveAppModule('test-module', appPath)).to.be.true;
      expect(resolve.calledOnceWith('test-module')).to.be.true;
    });

    it('should return false when the module cannot be resolved', () => {
      const resolve = sinon.stub().throws(new Error('not found'));
      const createRequireStub = sinon.stub().returns(Object.assign(sinon.stub(), { resolve }));
      const { canResolveAppModule } = loadWithCreateRequire(createRequireStub);

      expect(canResolveAppModule('missing-module', appPath)).to.be.false;
    });
  });

  describe('isMissingAppModuleSubpath', () => {
    const specifier = '@sitecore-content-sdk/nextjs/capabilities';

    it('should return false when the value is not a module resolution error', () => {
      const { isMissingAppModuleSubpath } = loadWithCreateRequire(sinon.stub());

      expect(isMissingAppModuleSubpath(undefined, specifier, appPath)).to.be.false;
      expect(isMissingAppModuleSubpath(new Error('failed'), specifier, appPath)).to.be.false;
    });

    it('should return true for an unexported package subpath', () => {
      const { isMissingAppModuleSubpath } = loadWithCreateRequire(sinon.stub());
      const error = Object.assign(new Error('not exported'), {
        code: 'ERR_PACKAGE_PATH_NOT_EXPORTED',
      });

      expect(isMissingAppModuleSubpath(error, specifier, appPath)).to.be.true;
    });

    it('should return true when a scoped package exists but its subpath file does not', () => {
      const resolve = sinon.stub().returns('/app/node_modules/@sitecore-content-sdk/nextjs');
      const createRequireStub = sinon.stub().returns(Object.assign(sinon.stub(), { resolve }));
      const { isMissingAppModuleSubpath } = loadWithCreateRequire(createRequireStub);
      const error = Object.assign(new Error(`Cannot find module '${specifier}'`), {
        code: 'MODULE_NOT_FOUND',
      });

      expect(isMissingAppModuleSubpath(error, specifier, appPath)).to.be.true;
      expect(resolve.calledOnceWith('@sitecore-content-sdk/nextjs')).to.be.true;
    });

    it('should return false when an unscoped package cannot be resolved', () => {
      const resolve = sinon.stub().throws(new Error('not found'));
      const createRequireStub = sinon.stub().returns(Object.assign(sinon.stub(), { resolve }));
      const { isMissingAppModuleSubpath } = loadWithCreateRequire(createRequireStub);
      const error = Object.assign(new Error("Cannot find module 'test-package/capabilities'"), {
        code: 'MODULE_NOT_FOUND',
      });

      expect(
        isMissingAppModuleSubpath(error, 'test-package/capabilities', appPath)
      ).to.be.false;
      expect(resolve.calledOnceWith('test-package')).to.be.true;
    });

    it('should return false when MODULE_NOT_FOUND refers to another module', () => {
      const createRequireStub = sinon.stub();
      const { isMissingAppModuleSubpath } = loadWithCreateRequire(createRequireStub);
      const error = Object.assign(new Error("Cannot find module 'another-package'"), {
        code: 'MODULE_NOT_FOUND',
      });

      expect(isMissingAppModuleSubpath(error, specifier, appPath)).to.be.false;
      expect(createRequireStub.notCalled).to.be.true;
    });
  });
});
