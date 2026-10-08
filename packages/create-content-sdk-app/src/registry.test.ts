/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import spawn from 'cross-spawn';
import proxyquire from 'proxyquire';

chai.use(sinonChai);

const captureError = async (fn: () => Promise<unknown>): Promise<Error | undefined> => {
  try {
    await fn();
  } catch (error) {
    return error as Error;
  }
  return undefined;
};

// A controlled stand-in for the bundled angular template package, so tests exercise
// the registry's own logic rather than the real @sitecore-content-sdk/angular-templates.
const mockAngularInit = {
  name: 'angular',
  prompts: [],
  templatePath: '/templates/angular',
  versions: {
    '@sitecore-content-sdk/angular': '^1.0.0',
    '@sitecore-content-sdk/cli': '^2.3.0',
  },
};

// Loads registry.ts with the angular template package mocked to the given initializers.
const loadRegistry = (initializers: unknown[] = [mockAngularInit]): typeof import('./registry') =>
  proxyquire.noCallThru().load('./registry', {
    '@sitecore-content-sdk/angular-templates': { default: initializers, __esModule: true },
  });

describe('registry', () => {
  let registry: typeof import('./registry');

  beforeEach(() => {
    registry = loadRegistry();
  });

  describe('getProduct', () => {
    it('does identify the product for a bare framework template', () => {
      expect(registry.getProduct('nextjs')).to.equal('nextjs');
      expect(registry.getProduct('angular')).to.equal('angular');
    });

    it('does identify the product for a variant template', () => {
      expect(registry.getProduct('nextjs-custom')).to.equal('nextjs');
      expect(registry.getProduct('nextjs-app-router')).to.equal('nextjs');
      expect(registry.getProduct('nextjs-app-router-cache-components')).to.equal('nextjs');
    });

    it('does return undefined for a template with no product prefix', () => {
      expect(registry.getProduct('')).to.be.undefined;
      expect(registry.getProduct('123')).to.be.undefined;
    });
  });

  describe('getAllTemplates', () => {
    it('does list the templates provided by the bundled template packages', () => {
      expect(registry.getAllTemplates()).to.deep.equal([
        'angular',
        'nextjs',
        'nextjs-app-router',
        'nextjs-app-router-cache-components',
      ]);
    });
  });

  describe('getInitializerData', () => {
    describe('static path (no version requested)', () => {
      it('does return the bundled initializer data for a known template', async () => {
        const initializer = await registry.getInitializerData('angular');

        expect(initializer.name).to.equal('angular');
        expect(initializer.templatePath).to.equal(mockAngularInit.templatePath);
        expect(initializer.prompts).to.be.an('array');
      });

      it('does stamp the template package versions onto the returned initializer', async () => {
        const initializer = await registry.getInitializerData('angular');

        expect(initializer.versions).to.deep.equal(mockAngularInit.versions);
      });

      it('does throw for an unknown template', async () => {
        const thrown = await captureError(() => registry.getInitializerData('does-not-exist'));

        expect(thrown).to.be.instanceOf(Error);
        expect(thrown?.message).to.contain('does-not-exist');
      });

      it('does not attempt to install anything', async () => {
        const spawnSyncStub = sinon.stub(spawn, 'sync');

        try {
          await registry.getInitializerData('angular');
          expect(spawnSyncStub).to.not.have.been.called;
        } finally {
          spawnSyncStub.restore();
        }
      });
    });

    describe('dynamic path (version requested)', () => {
      it('does reject a legacy (pre-2) nextjs template version', async () => {
        const thrown = await captureError(() => registry.getInitializerData('nextjs', 1));

        expect(thrown).to.be.instanceOf(Error);
        expect(thrown?.message).to.contain('create-content-sdk-app@1');
        expect(thrown?.message).to.contain("version '1'");
      });

      describe('when the requested version cannot be installed', () => {
        let spawnSyncStub: SinonStub;

        beforeEach(() => {
          spawnSyncStub = sinon
            .stub(spawn, 'sync')
            .returns({ status: 1 } as ReturnType<typeof spawn.sync>);
        });

        afterEach(() => {
          spawnSyncStub?.restore();
        });

        it('does report that the requested version could not be loaded', async () => {
          const thrown = await captureError(() => registry.getInitializerData('nextjs', 99));

          expect(spawnSyncStub).to.have.been.calledOnce;
          expect(thrown).to.be.instanceOf(Error);
          expect(thrown?.message).to.contain('Could not load');
          expect(thrown?.message).to.contain('99');
        });
      });

      describe('when a supported custom version is installed via lazy loading', () => {
        const product = 'nextjs';
        const pkgName = `@sitecore-content-sdk/${product}-templates`;
        const requestedVersion = 2;
        const installedVersions = { '@sitecore-content-sdk/nextjs': '^2.5.0' };

        let spawnSyncStub: SinonStub;
        let mkdtempStub: SinonStub;
        let tempRoot: string;
        let packageDir: string;

        beforeEach(() => {
          // Stand up a fake installed template package that lazy loading will import.
          tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-test-'));
          packageDir = path.join(tempRoot, 'node_modules', pkgName);
          fs.mkdirsSync(packageDir);
          fs.writeFileSync(
            path.join(packageDir, 'package.json'),
            JSON.stringify({
              name: pkgName,
              version: '2.5.0',
              main: 'index.js',
            })
          );
          fs.writeFileSync(
            path.join(packageDir, 'index.js'),
            'Object.defineProperty(exports, "__esModule", { value: true });\n' +
              'exports.default = [{ name: "nextjs", prompts: [], templatePath: "/tmp/nextjs", ' +
              `versions: ${JSON.stringify(installedVersions)} }];`
          );

          // Skip the real `npm install` and point the temp-dir creation at our fixture.
          spawnSyncStub = sinon
            .stub(spawn, 'sync')
            .returns({ status: 0 } as ReturnType<typeof spawn.sync>);
          mkdtempStub = sinon.stub(fs, 'mkdtempSync').returns(tempRoot);
        });

        afterEach(() => {
          spawnSyncStub?.restore();
          mkdtempStub?.restore();
          fs.removeSync(tempRoot);
        });

        it('does install the exact requested version on demand', async () => {
          await registry.getInitializerData('nextjs', requestedVersion);

          expect(spawnSyncStub).to.have.been.calledOnce;
          const [command, cmdArgs] = spawnSyncStub.getCall(0).args as [string, string[]];
          expect(command).to.equal('npm');
          expect(cmdArgs).to.include('install');
          expect(cmdArgs.some((arg) => arg.includes(`-templates@${requestedVersion}`))).to.be.true;
        });

        it('does return the initializer imported from the lazily installed package', async () => {
          const initializer = await registry.getInitializerData('nextjs', requestedVersion);

          expect(initializer.name).to.equal('nextjs');
          expect(initializer.versions).to.deep.equal(installedVersions);
        });
      });
    });
  });
});

