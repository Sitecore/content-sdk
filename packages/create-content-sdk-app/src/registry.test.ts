/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import spawn from 'cross-spawn';
import { getAllTemplates, getInitializer } from './registry';

chai.use(sinonChai);

const captureError = async (fn: () => Promise<unknown>): Promise<Error | undefined> => {
  try {
    await fn();
  } catch (error) {
    return error as Error;
  }
  return undefined;
};

describe('registry', () => {
  describe('getAllTemplates', () => {
    it('should list every known template', () => {
      const templates = getAllTemplates();

      expect(templates).to.include.members([
        'nextjs',
        'nextjs-app-router',
        'nextjs-app-router-cache-components',
        'angular',
      ]);
    });
  });

  describe('getInitializer', () => {
    it('should throw for an unknown template', async () => {
      const thrown = await captureError(() => getInitializer('does-not-exist'));

      expect(thrown).to.be.instanceOf(Error);
      expect(thrown?.message).to.contain('does-not-exist');
    });

    it('should reject a nextjs template version below the supported baseline', async () => {
      const thrown = await captureError(() => getInitializer('nextjs', '2.3.0'));

      expect(thrown).to.be.instanceOf(Error);
      expect(thrown?.message).to.contain('2.4.0');
      expect(thrown?.message).to.contain('create-content-sdk-app@2');
    });

    it('should reject an angular template version below the supported baseline', async () => {
      const thrown = await captureError(() => getInitializer('angular', '0.9.0'));

      expect(thrown).to.be.instanceOf(Error);
      expect(thrown?.message).to.contain('1.0.0');
      expect(thrown?.message).to.contain('create-content-sdk-app@2');
    });

    describe('when the requested version cannot be installed', () => {
      let spawnSyncStub: SinonStub;

      beforeEach(() => {
        spawnSyncStub = sinon.stub(spawn, 'sync').returns({ status: 1 } as ReturnType<
          typeof spawn.sync
        >);
      });

      afterEach(() => {
        spawnSyncStub?.restore();
      });

      it('should report that a supported-but-missing version could not be loaded', async () => {
        const thrown = await captureError(() => getInitializer('nextjs', '99.0.0'));

        expect(spawnSyncStub).to.have.been.calledOnce;
        expect(thrown).to.be.instanceOf(Error);
        expect(thrown?.message).to.contain('Could not load');
        expect(thrown?.message).to.contain('99.0.0');
      });
    });

    describe('when a supported custom version is installed via lazy loading', () => {
      const pkgName = '@sitecore-content-sdk/nextjs-templates';
      const requestedVersion = '2.5.0';

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
            version: requestedVersion,
            main: 'index.js',
            devDependencies: {
              '@sitecore-content-sdk/nextjs': '^2.5.0',
              typescript: '~5.8.3',
            },
          })
        );
        fs.writeFileSync(
          path.join(packageDir, 'index.js'),
          'module.exports = { initializers: { nextjs: { init: () => Promise.resolve({}) } } };'
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

      it('should install the requested version and return its initializer and versions', async () => {
        const { initializer, versions } = await getInitializer('nextjs', requestedVersion);

        // installs the exact requested version on demand
        expect(spawnSyncStub).to.have.been.calledOnce;
        const [command, cmdArgs] = spawnSyncStub.getCall(0).args as [string, string[]];
        expect(command).to.equal('npm');
        expect(cmdArgs).to.include('install');
        expect(cmdArgs).to.include(`${pkgName}@${requestedVersion}`);

        // imports the initializer from the lazily installed package
        expect(initializer.init).to.be.a('function');

        // reads Content SDK versions from the installed package's package.json
        expect(versions).to.deep.equal({ '@sitecore-content-sdk/nextjs': '^2.5.0' });
      });
    });
  });
});
