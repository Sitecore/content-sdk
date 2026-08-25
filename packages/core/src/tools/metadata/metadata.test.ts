/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { getMetadata } from './metadata';
import sinon, { SinonStub } from 'sinon';
import childProcess from 'child_process';
import metadataNextjs from './test-data/metadata-nextjs.json';
import npmQueryResultNext from './test-data/npm-query-nextjs.json';
import npmQueryResultNoSc from './test-data/npm-query-no-sc.json';

const USER_AGENTS = {
  npm: 'npm/11.6.2 node/v24.4.0 win32 x64 workspaces/false',
  pnpm: 'pnpm/10.33.0 npm/? node/v22.11.0 win32 x64',
  yarn: 'yarn/4.12.0 npm/? node/v24.4.0 win32 x64',
  yarnClassic: 'yarn/1.22.22 npm/? node/v20.11.0 darwin arm64',
  bun: 'bun/1.2.21 npm/? node/v24.3.0 linux x64',
};

const NPM_QUERY = 'npm query [name*=@sitecore] --workspaces false';
const PNPM_LIST = 'pnpm list --depth Infinity --parseable --long';
const YARN_INFO = 'yarn info --json --name-only --recursive "@sitecore*/*"';
const YARN_CLASSIC_LIST = 'yarn list --json --depth 0 --pattern "@sitecore*/*"';
const BUN_LIST = 'bun pm ls --all';

// `pnpm list --parseable --long` reports an install path and the package it holds per line. The
// project itself and the links in its node_modules are listed next to the packages in the pnpm
// store, and paths hold a drive letter when the app runs on Windows.
const pnpmListResult = [
  '/app:next-new-app@0.1.0',
  '/app/node_modules/.pnpm/@sitecore-content-sdk+nextjs@22.2.0-canary.69/node_modules/@sitecore-content-sdk/nextjs:@sitecore-content-sdk/nextjs@22.2.0-canary.69',
  '/app/node_modules/@sitecore-content-sdk/nextjs:@sitecore-content-sdk/nextjs@22.2.0-canary.69',
  '/app/node_modules/.pnpm/@sitecore-content-sdk+core@22.2.0-canary.69/node_modules/@sitecore-content-sdk/core:@sitecore-content-sdk/core@22.2.0-canary.69',
  '/app/node_modules/.pnpm/@sitecore-cloudsdk+events@0.3.1/node_modules/@sitecore-cloudsdk/events:@sitecore-cloudsdk/events@0.3.1',
  '/app/node_modules/.pnpm/@sitecore-cloudsdk+core@0.3.1/node_modules/@sitecore-cloudsdk/core:@sitecore-cloudsdk/core@0.3.1',
  'C:\\app\\node_modules\\.pnpm\\@sitecore+components@2.1.2_react@19.2.8\\node_modules\\@sitecore\\components:@sitecore/components@2.1.2',
  '/app/node_modules/.pnpm/@sitecore+byoc@0.3.4_react@19.2.8/node_modules/@sitecore/byoc:@sitecore/byoc@0.3.4',
  '/app/node_modules/.pnpm/next@14.2.7/node_modules/next:next@14.2.7',
  '/app/node_modules/.pnpm/@sitecore-content-sdk+cli@22.2.0-canary.69/node_modules/@sitecore-content-sdk/cli:@sitecore-content-sdk/cli@22.2.0-canary.69',
].join('\n');

const pnpmMetadata = {
  packages: {
    '@sitecore-content-sdk/nextjs': '22.2.0-canary.69',
    '@sitecore-content-sdk/core': '22.2.0-canary.69',
    '@sitecore-cloudsdk/events': '0.3.1',
    '@sitecore-cloudsdk/core': '0.3.1',
    '@sitecore/components': '2.1.2',
    '@sitecore/byoc': '0.3.4',
    '@sitecore-content-sdk/cli': '22.2.0-canary.69',
  },
};

const setEnv = (name: string, value?: string) => {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
};

describe('metadata', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getMetadata', () => {
    let execSyncStub: SinonStub;
    let logStub: SinonStub;

    const { npm_config_user_agent: userAgent, npm_execpath: execPath } = process.env;

    // The package manager in use is detected from the environment it sets up for the commands it
    // runs, which is the environment these tests run in themselves.
    const runWithPackageManager = (packageManagerUserAgent?: string) => {
      setEnv('npm_execpath');
      setEnv('npm_config_user_agent', packageManagerUserAgent);
    };

    beforeEach(() => {
      execSyncStub = sinon.stub(childProcess, 'execSync');
    });

    afterEach(() => {
      execSyncStub?.restore();
      logStub?.restore();

      setEnv('npm_config_user_agent', userAgent);
      setEnv('npm_execpath', execPath);
    });

    it('should return tracked packages with exact versions from result of npm query (nextjs app)', () => {
      runWithPackageManager(USER_AGENTS.npm);
      execSyncStub.withArgs(NPM_QUERY).returns(JSON.stringify(npmQueryResultNext));

      const metadata = getMetadata();

      expect(execSyncStub.calledOnceWith(NPM_QUERY)).to.be.true;
      expect(metadata).to.deep.equal(metadataNextjs);
    });

    it('should use npm when the package manager could not be determined', () => {
      runWithPackageManager();
      execSyncStub.withArgs(NPM_QUERY).returns(JSON.stringify(npmQueryResultNext));

      const metadata = getMetadata();

      expect(execSyncStub.calledOnceWith(NPM_QUERY)).to.be.true;
      expect(metadata).to.deep.equal(metadataNextjs);
    });

    it('should detect the package manager from the executable path when there is no user agent', () => {
      runWithPackageManager();
      setEnv('npm_execpath', '/usr/local/share/pnpm/store/v10/pnpm/bin/pnpm.cjs');
      execSyncStub.withArgs(PNPM_LIST).returns(pnpmListResult);

      const metadata = getMetadata();

      expect(execSyncStub.calledOnceWith(PNPM_LIST)).to.be.true;
      expect(metadata).to.deep.equal(pnpmMetadata);
    });

    it('should return tracked packages with exact versions from result of pnpm list', () => {
      runWithPackageManager(USER_AGENTS.pnpm);
      execSyncStub.withArgs(PNPM_LIST).returns(pnpmListResult);

      const metadata = getMetadata();

      expect(execSyncStub.calledOnceWith(PNPM_LIST)).to.be.true;
      expect(metadata).to.deep.equal(pnpmMetadata);
    });

    it('should return tracked packages with exact versions from result of yarn info', () => {
      runWithPackageManager(USER_AGENTS.yarn);
      execSyncStub.withArgs(YARN_INFO).returns(
        [
          '{"value":"@sitecore-content-sdk/nextjs@npm:22.2.0-canary.69","children":{}}',
          '"@sitecore-content-sdk/core@npm:22.2.0-canary.69"',
          '{"value":"@sitecore-content-sdk/react@virtual:1a2b3c#npm:22.2.0-canary.69"}',
          '➤ YN0000: a diagnostic that is not json',
          '',
        ].join('\n')
      );

      const metadata = getMetadata();

      expect(execSyncStub.calledOnceWith(YARN_INFO)).to.be.true;
      expect(metadata).to.deep.equal({
        packages: {
          '@sitecore-content-sdk/nextjs': '22.2.0-canary.69',
          '@sitecore-content-sdk/core': '22.2.0-canary.69',
          '@sitecore-content-sdk/react': '22.2.0-canary.69',
        },
      });
    });

    it('should return tracked packages with exact versions from result of yarn classic list', () => {
      runWithPackageManager(USER_AGENTS.yarnClassic);
      execSyncStub.withArgs(YARN_CLASSIC_LIST).returns(
        [
          '{"type":"progressStart","data":{"id":0,"total":5}}',
          '{"type":"tree","data":{"type":"list","trees":[{"name":"@sitecore-content-sdk/core@22.2.0-canary.69","children":[],"depth":0},{"name":"@sitecore/byoc@0.2.15","children":[],"depth":0}]}}',
        ].join('\n')
      );

      const metadata = getMetadata();

      expect(execSyncStub.calledOnceWith(YARN_CLASSIC_LIST)).to.be.true;
      expect(metadata).to.deep.equal({
        packages: {
          '@sitecore-content-sdk/core': '22.2.0-canary.69',
          '@sitecore/byoc': '0.2.15',
        },
      });
    });

    it('should return tracked packages with exact versions from result of bun pm ls', () => {
      runWithPackageManager(USER_AGENTS.bun);
      execSyncStub
        .withArgs(BUN_LIST)
        .returns(
          [
            '/app node_modules (135)',
            '├── @sitecore-content-sdk/core@22.2.0-canary.69',
            '│   └── @sitecore-cloudsdk/core@0.3.1',
            '└── next@14.2.7',
            '',
          ].join('\n')
        );

      const metadata = getMetadata();

      expect(execSyncStub.calledOnceWith(BUN_LIST)).to.be.true;
      expect(metadata).to.deep.equal({
        packages: {
          '@sitecore-content-sdk/core': '22.2.0-canary.69',
          '@sitecore-cloudsdk/core': '0.3.1',
        },
      });
    });

    it('should include workspace packages when workspaces are allowed', () => {
      runWithPackageManager(USER_AGENTS.pnpm);
      const command = 'pnpm list --depth Infinity --parseable --long --recursive';
      execSyncStub.withArgs(command).returns(pnpmListResult);

      const metadata = getMetadata(true);

      expect(execSyncStub.calledOnceWith(command)).to.be.true;
      expect(metadata).to.deep.equal(pnpmMetadata);
    });

    it('should return metadata with empty package object and log error in the console if result of npm query is not valid', () => {
      runWithPackageManager(USER_AGENTS.npm);
      execSyncStub.withArgs(NPM_QUERY).returns('[{"name":}');
      logStub = sinon.stub(console, 'error');

      const metadata = getMetadata();

      expect(logStub.calledOnceWith(`Failed to retrieve sitecore packages using '${NPM_QUERY}'`)).to
        .be.true;
      expect(metadata).to.deep.equal({ packages: {} });
    });

    it('should return metadata with empty package object and log error in the console if the query command fails', () => {
      runWithPackageManager(USER_AGENTS.pnpm);
      execSyncStub.withArgs(PNPM_LIST).throws();
      logStub = sinon.stub(console, 'error');

      const metadata = getMetadata();

      expect(logStub.calledOnceWith(`Failed to retrieve sitecore packages using '${PNPM_LIST}'`)).to
        .be.true;
      expect(metadata).to.deep.equal({ packages: {} });
    });

    it('should not return packages for result of npm query not containng tracked packages', () => {
      runWithPackageManager(USER_AGENTS.npm);
      execSyncStub.withArgs(NPM_QUERY).returns(JSON.stringify(npmQueryResultNoSc));

      const metadata = getMetadata();

      expect(metadata).to.deep.equal({ packages: {} });
    });
  });
});
