/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { getMetadata } from './metadata';
import sinon, { SinonStub } from 'sinon';
import childProcess from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import metadataNextjs from './test-data/metadata-nextjs.json';
import npmQueryResultNext from './test-data/npm-query-nextjs.json';
import npmQueryResultNoSc from './test-data/npm-query-no-sc.json';

describe('metadata', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getMetadata', () => {
    let execSyncStub: SinonStub;
    let logStub: SinonStub;
    const originalExecPath = process.env.npm_execpath;
    const originalUserAgent = process.env.npm_config_user_agent;

    afterEach(() => {
      execSyncStub?.restore();
      logStub?.restore();

      if (originalExecPath === undefined) {
        delete process.env.npm_execpath;
      } else {
        process.env.npm_execpath = originalExecPath;
      }

      if (originalUserAgent === undefined) {
        delete process.env.npm_config_user_agent;
      } else {
        process.env.npm_config_user_agent = originalUserAgent;
      }
    });

    it('should return tracked packages with exact versions from result of npm query (nextjs app)', () => {
      delete process.env.npm_execpath;
      process.env.npm_config_user_agent = 'npm/10.0.0 node/v22.0.0';
      execSyncStub = sinon.stub(childProcess, 'execSync');
      execSyncStub
        .withArgs('npm query [name*=@sitecore] --workspaces false')
        .returns(JSON.stringify(npmQueryResultNext));
      const metadata = getMetadata();
      expect(metadata).to.deep.equal(metadataNextjs);
    });

    it('should return metadata with empty package object and log error in the console if result of npm query is not valid', () => {
      delete process.env.npm_execpath;
      process.env.npm_config_user_agent = 'npm/10.0.0 node/v22.0.0';
      execSyncStub = sinon.stub(childProcess, 'execSync');
      execSyncStub.withArgs('npm query [name*=@sitecore] --workspaces false').returns('[{"name":}');
      logStub = sinon.stub(console, 'error');

      const metadata = getMetadata();
      expect(logStub.calledOnceWith('Failed to retrieve sitecore packages using npm query')).to.be
        .true;
      expect(metadata).to.deep.equal({ packages: {} });
    });

    it('should return metadata with empty package object and log error in the console if npm query command fails', () => {
      delete process.env.npm_execpath;
      process.env.npm_config_user_agent = 'npm/10.0.0 node/v22.0.0';
      execSyncStub = sinon.stub(childProcess, 'execSync');
      execSyncStub.withArgs('npm query [name*=@sitecore] --workspaces false').throws();
      logStub = sinon.stub(console, 'error');

      const metadata = getMetadata();
      expect(logStub.calledOnceWith('Failed to retrieve sitecore packages using npm query')).to.be
        .true;
      expect(metadata).to.deep.equal({ packages: {} });
    });

    it('should not return packages for result of npm query not containng tracked packages', () => {
      delete process.env.npm_execpath;
      process.env.npm_config_user_agent = 'npm/10.0.0 node/v22.0.0';
      execSyncStub = sinon.stub(childProcess, 'execSync');
      execSyncStub
        .withArgs('npm query [name*=@sitecore] --workspaces false')
        .returns(JSON.stringify(npmQueryResultNoSc));
      const metadata = getMetadata();
      expect(metadata).to.deep.equal({ packages: {} });
    });

    it('should read sitecore packages from node_modules instead of npm when invoked by pnpm', () => {
      process.env.npm_execpath = path.join('home', 'user', 'pnpm', 'pnpm.cjs');
      process.env.npm_config_user_agent = 'pnpm/10.33.0 npm/? node/v22.0.0';
      execSyncStub = sinon.stub(childProcess, 'execSync');

      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'metadata-pnpm-'));
      writeInstalledPackage(tmp, '@sitecore-content-sdk/nextjs', '1.2.3');
      writeInstalledPackage(tmp, '@sitecore/components', '2.0.0');
      fs.writeFileSync(path.join(tmp, 'pnpm-lock.yaml'), '');

      try {
        const metadata = withCwd(tmp, () => getMetadata());

        expect(execSyncStub.notCalled).to.be.true;
        expect(metadata.packages).to.deep.equal({
          '@sitecore-content-sdk/nextjs': '1.2.3',
          '@sitecore/components': '2.0.0',
        });
      } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
      }
    });

    it('should include sitecore packages hoisted to the monorepo root when invoked by pnpm', () => {
      process.env.npm_execpath = path.join('home', 'user', 'pnpm', 'pnpm.cjs');
      process.env.npm_config_user_agent = 'pnpm/10.33.0 npm/? node/v22.0.0';
      execSyncStub = sinon.stub(childProcess, 'execSync');

      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'metadata-pnpm-mono-'));
      const appDir = path.join(tmp, 'apps', 'web');
      fs.mkdirSync(appDir, { recursive: true });
      fs.writeFileSync(path.join(tmp, 'pnpm-lock.yaml'), '');
      fs.writeFileSync(
        path.join(appDir, 'package.json'),
        JSON.stringify({ name: 'web', private: true })
      );
      writeInstalledPackage(tmp, '@sitecore-content-sdk/core', '9.9.9');

      try {
        const metadata = withCwd(appDir, () => getMetadata());

        expect(execSyncStub.notCalled).to.be.true;
        expect(metadata.packages).to.deep.equal({
          '@sitecore-content-sdk/core': '9.9.9',
        });
      } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
      }
    });
  });
});

function writeInstalledPackage(root: string, name: string, version: string): void {
  const dir = path.join(root, 'node_modules', ...name.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name, version }));
}

function withCwd<T>(dir: string, fn: () => T): T {
  const cwd = process.cwd();
  process.chdir(dir);
  try {
    return fn();
  } finally {
    process.chdir(cwd);
  }
}
