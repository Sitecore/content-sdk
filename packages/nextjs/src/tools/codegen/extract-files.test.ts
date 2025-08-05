/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import fs from 'fs';
import nock from 'nock';
import path from 'path';
import { defineConfig } from '@sitecore-content-sdk/core/config';
import { auth } from '@sitecore-content-sdk/core/tools';
import { extractFiles } from './extract-files';
import { debug } from '@sitecore-content-sdk/core';

describe('extract-files', () => {
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

  const edgeUrl = defaultConfig.api.edge.edgeUrl;

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

  beforeEach(() => {
    process.env.SITECORE = 'true';
    process.env.SITECORE_BUILD = '0451';
    process.env.SITECORE_AUTH_CLIENT_ID = 'test-client-id';
    process.env.SITECORE_AUTH_CLIENT_SECRET = 'test-client-secret';
    sandbox.stub(fs, 'existsSync').returns(true);
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.SITECORE;
    delete process.env.SITECORE_AUTH_CLIENT_ID;
    delete process.env.SITECORE_AUTH_CLIENT_SECRET;
    delete process.env.SITECORE_BUILD;
  });

  it('should skip when not in deploy context', async() => {
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

  it('should skip when code generation is opted out', async() => {
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

  it('should use customValidateDeployContext', async() => {
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

  it('should log when access token is empty', async() => {
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

  it('should catch exceptions from resolveImportFiles call', async() => {
    const args = {
      ...mockArgs,
    };
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
    const expectedPath = path.resolve(process.cwd(), './.sitecore/component-map.ts');
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red('Error during code extraction: ReferenceError: Failed to find file', expectedPath)
    );
  });

  it('should call sendCode for each component path and package.json', async() => {
    const args = {
      ...mockArgs,
    };
    const appFolder = path.resolve(
      process.cwd(),
      './src/tools/codegen/test-data/extract-components/regular-imports'
    );
    sandbox.stub(process, 'cwd').returns(appFolder);

    const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: 'test-token' });
    sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

    const consoleLogStub = sandbox.stub(console, 'log');

    nock(edgeUrl).post('/mesh/push/api/v1/contentsdk/code/extracted').reply(200).persist();

    const component1Path = path.resolve(process.cwd(), './src/components/TestComponent.tsx');

    const component2Path = path.resolve(process.cwd(), './src/components/TestComponent2.tsx');

    const packageJsonPath = path.resolve(process.cwd(), './package.json');

    const extractFilesCall = extractFiles(args);
    await extractFilesCall();

    expect(fetchBearerTokenStub.calledOnce).to.be.true;

    expect(consoleLogStub.callCount).to.equal(2);
    expect(consoleLogStub.getCall(0).args[0]).to.equal(chalk.green('Code extraction started'));
    expect(consoleLogStub.getCall(1).args[0]).to.equal(
      chalk.green(
        [
          'Code extraction completed successfully, files extracted:',
          component1Path,
          component2Path,
          packageJsonPath,
        ].join('\r\n')
      )
    );
  });
});
