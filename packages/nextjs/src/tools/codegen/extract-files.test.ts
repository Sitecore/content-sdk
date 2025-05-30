import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import fs from 'fs';
import { extractFiles } from './extract-files';
import { defineConfig } from '@sitecore-content-sdk/core/config';
import nock from 'nock';
import { auth } from '@sitecore-content-sdk/core/tools';
import path from 'path';

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
    },
  };

  beforeEach(() => {
    process.env.EXTRACT_CONSENT = 'true';
    process.env.SITECORE = 'true';
    process.env.BuildMetadata_BuildId = '0451';
    process.env.SITECORE_AUTH_CLIENT_ID = 'test-client-id';
    process.env.SITECORE_AUTH_CLIENT_SECRET = 'test-client-secret';
    sandbox.stub(fs, 'existsSync').returns(true);
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.EXTRACT_CONSENT;
    delete process.env.SITECORE;
    delete process.env.SITECORE_AUTH_CLIENT_ID;
    delete process.env.SITECORE_AUTH_CLIENT_SECRET;
    delete process.env.BuildMetadata_BuildId;
  });

  it('should log when bearer is empty', async () => {
    const consoleErrorStub = sandbox.stub(console, 'error');
    const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: '' });
    sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

    const extractFilesCall = extractFiles(mockArgs);
    await extractFilesCall();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red('Failed to get bearer token, aborting code extraction')
    );
  });

  it('should catch exceptions from resolveImportFiles call', async () => {
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
    const expectedPath = path.resolve(process.cwd(), './src/lib/component-map.ts');
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red(
        'Error during component extraction: ReferenceError: Failed to find file',
        expectedPath
      )
    );
  });

  it('should call sendCode for each component path and package.json', async () => {
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

    nock(edgeUrl)
      .post('/api/v1/contentsdk/code/extracted')
      .reply(200)
      .persist();

    const component1Path = path.resolve(process.cwd(), './src/components/TestComponent.tsx');

    const component2Path = path.resolve(process.cwd(), './src/components/TestComponent2.tsx');

    const packageJsonPath = path.resolve(process.cwd(), './package.json');

    const extractFilesCall = extractFiles(args);
    await extractFilesCall();

    expect(fetchBearerTokenStub.calledOnce).to.be.true;

    expect(consoleLogStub.callCount).to.equal(3);

    expect(consoleLogStub.getCall(0).args[0]).to.equal(
      chalk.green(`Contents from ${component1Path} extracted and sent to mesh endpoint`)
    );

    expect(consoleLogStub.getCall(1).args[0]).to.equal(
      chalk.green(`Contents from ${component2Path} extracted and sent to mesh endpoint`)
    );

    expect(consoleLogStub.getCall(2).args[0]).to.equal(
      chalk.green(`Contents from ${packageJsonPath} extracted and sent to mesh endpoint`)
    );
  });
});
