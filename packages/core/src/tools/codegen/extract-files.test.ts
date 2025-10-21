/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { defineConfig } from './../../config';
import { auth } from '../../tools';
import { extractFiles } from './extract-files';
import debug from './../../debug';

describe.only('extract-files', () => {
  const sandbox = sinon.createSandbox();
  const defaultConfig = defineConfig({
    api: {
      edge: {
        contextId: '12345',
      },
      local: undefined,
    },
    defaultLanguage: '',
  });

  const mockArgs = {
    scConfig: {
      ...defaultConfig,
      api: {
        ...defaultConfig.api,
        edge: {
          ...defaultConfig.api.edge,
        },
      },
      disableCodeGeneration: false,
    },
  };

  let fetchFake: sinon.SinonSpy;
  let existsSyncStub: sinon.SinonStub;
  let fetchBehavior: (url: any, init: any) => Promise<any>;

  beforeEach(() => {
    process.env.SITECORE = 'true';
    process.env.SITECORE_BUILD = '0451';
    process.env.SITECORE_AUTH_CLIENT_ID = 'test-client-id';
    process.env.SITECORE_AUTH_CLIENT_SECRET = 'test-client-secret';

    fetchBehavior = async () =>
      ({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: 'https://example/mesh/push/api/v1/contentsdk/code/extracted',
        headers: {},
        text: async () => '',
      } as any);

    fetchFake = sinon.fake((url: any, init: any) => fetchBehavior(url, init));
    sandbox.replace(globalThis as any, 'fetch', fetchFake);

    existsSyncStub = sandbox.stub(fs, 'existsSync').returns(true);
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.SITECORE;
    delete process.env.SITECORE_AUTH_CLIENT_ID;
    delete process.env.SITECORE_AUTH_CLIENT_SECRET;
    delete process.env.SITECORE_BUILD;
  });

  it('should skip when not in deploy context', async () => {
    const debugStub = sandbox.stub(debug, 'common');
    const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: '' });
    sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

    delete process.env.SITECORE;
    delete process.env.SITECORE_AUTH_CLIENT_ID;
    delete process.env.SITECORE_AUTH_CLIENT_SECRET;
    delete process.env.SITECORE_BUILD;

    const extractFilesCall = extractFiles(mockArgs);
    await extractFilesCall();

    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.firstCall.args[0]).to.equal('Skipping code extraction, not in deploy context');
  });

  it('should skip when code generation is opted out', async () => {
    const debugStub = sandbox.stub(debug, 'common');
    const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: '' });
    sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

    const args = {
      ...mockArgs,
      scConfig: {
        ...mockArgs.scConfig,
        disableCodeGeneration: true,
      },
    };

    const extractFilesCall = extractFiles(args);
    await extractFilesCall();

    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.firstCall.args[0]).to.equal(
      'Skipping code extraction, code generation has been disabled'
    );
  });

  it('should use customValidateDeployContext', async () => {
    const debugStub = sandbox.stub(debug, 'common');
    const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: '' });
    sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);
    const args = {
      ...mockArgs,
      customValidateDeployContext: () => false,
    };

    const extractFilesCall = extractFiles(args);
    await extractFilesCall();

    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.firstCall.args[0]).to.equal('Skipping code extraction, not in deploy context');
  });

  it('should log when access token is empty', async () => {
    const consoleErrorStub = sandbox.stub(console, 'error');
    const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: '' });
    sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

    const extractFilesCall = extractFiles(mockArgs);
    await extractFilesCall();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red('Failed to get access token, aborting code extraction')
    );
  });

  it('should catch exceptions from resolveImportFiles call', async () => {
    const args = { ...mockArgs };

    const appFolder = path.resolve(
      process.cwd(),
      './src/tools/codegen/test-data/extract-components/no-componentBuilder'
    );
    sandbox.stub(process, 'cwd').returns(appFolder);

    const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: 'test-token' });
    sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

    const consoleErrorStub = sandbox.stub(console, 'error');

    const extractFilesCall = extractFiles(args);
    await extractFilesCall();

    expect(fetchBearerTokenStub.calledOnce).to.be.true;
    expect(consoleErrorStub.calledOnce).to.be.true;

    const logged = String(consoleErrorStub.firstCall.args[0]); // contains ANSI colors from chalk
    const expectedPath = path.resolve(appFolder, './.sitecore/component-map.ts');

    expect(logged).to.include('Error during code extraction:');
    expect(logged).to.include('ENOENT');
    const norm = (s: string) => s.replace(/\\/g, '/');
    expect(norm(logged)).to.include(norm(expectedPath));
  });

  it('should call sendCode for each component path and package.json', async () => {
    const prevCwd = process.cwd();
    const appFolder = path.resolve(
      prevCwd,
      './src/tools/codegen/test-data/extract-components/regular-imports'
    );
    process.chdir(appFolder);

    try {
      const tokenStub = sandbox.stub().resolves({ accessToken: 'test-token' });
      sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => tokenStub);

      const consoleLogStub = sandbox.stub(console, 'log');

      const run = extractFiles(mockArgs as any);
      await run();

      expect(tokenStub.calledOnce).to.equal(true);

      const logs = consoleLogStub.getCalls().map((c) => String(c.args[0]));
      expect(logs.some((m) => m.includes(chalk.green('Code extraction started')))).to.equal(true);

      const success = logs.find((m) => m.includes('Code extraction completed successfully'));
      expect(success, 'expected a success log').to.exist;

      expect(fetchFake.callCount).to.equal(3);

      const bodies = fetchFake.getCalls().map((call) => JSON.parse(call.args[1].body));

      const component1Path = path.resolve('./src/components/TestComponent.tsx');
      const component2Path = path.resolve('./src/components/TestComponent2.tsx');
      const packageJsonPath = path.resolve('./package.json');

      const names = bodies.map((b) => b.name).sort();
      expect(names).to.deep.equal(['TestComponent', 'Component1', 'package.json'].sort());

      bodies.forEach((b) => {
        expect(b.EnvironmentId).to.equal('ContentSDK');
        expect(b.labels).to.be.an('object');
      });

      const existsArgs = existsSyncStub
        .getCalls()
        .map((c) => String(c.args[0]).replace(/\\/g, '/'));
      const norm = (s: string) => s.replace(/\\/g, '/');
      expect(existsArgs.join('\n')).to.include(norm(component1Path));
      expect(existsArgs.join('\n')).to.include(norm(component2Path));
      expect(existsArgs.join('\n')).to.include(norm(packageJsonPath));
    } finally {
      process.chdir(prevCwd);
    }
  });
});
