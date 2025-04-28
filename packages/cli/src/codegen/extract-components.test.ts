import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import fs from 'fs';
import { extractComponents } from './extract-components';
import { defineConfig } from '@sitecore-content-sdk/core/config';
import nock from 'nock';
import { constants } from '@sitecore-content-sdk/core';
import path from 'path';

describe('extract-components', () => {
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
    },
    compilerOptions: {
      baseUrl: 'test-base-url',
      paths: {
        '*': ['*'],
      },
    },
    appFolder: '/path/to/app',
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
    delete process.env.BuildMetadata_BuildId;
  });

  it('should log when bearer is empty', async () => {
    const consoleErrorStub = sandbox.stub(console, 'error');
    const fetchBearerTokenStub = sandbox.stub();

    nock('https://auth.sitecorecloud.io')
      .post('/oauth/token')
      .reply(200, function(_, __, cb) {
        fetchBearerTokenStub();
        return cb(null, {});
      });

    const extractComponentsCall = extractComponents(mockArgs);
    await extractComponentsCall();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red('Failed to get bearer token, aborting code extraction')
    );
  });

  it('should catch exceptions from resolveImportFiles call', async () => {
    const args = {
      ...mockArgs,
      appFolder: './src/codegen/test-data/extract-components/no-componentBuilder',
    };
    const fetchBearerTokenSpy = sandbox.stub();

    nock('https://auth.sitecorecloud.io')
      .post('/oauth/token')
      .reply(200, function(_, __, cb) {
        fetchBearerTokenSpy();
        return cb(null, {
          access_token: 'test-token',
          expires_in: 3600,
          token_type: 'Bearer',
        });
      });
    const consoleErrorStub = sandbox.stub(console, 'error');
    const extractComponentsCall = extractComponents(args);
    await extractComponentsCall();

    expect(fetchBearerTokenSpy.calledOnce).to.be.true;
    expect(consoleErrorStub.calledOnce).to.be.true;
    const expectedPath = path.resolve(
      process.cwd(),
      './src/codegen/test-data/extract-components/no-componentBuilder/src/lib/componentMap.ts'
    );
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red(
        'Error during component extraction: ReferenceError: Failed to find file',
        expectedPath
      )
    );
  });

  it('should call sendCode for each component path', async () => {
    const args = {
      ...mockArgs,
      appFolder: './src/codegen/test-data/extract-components/regular-imports',
    };
    const fetchBearerTokenSpy = sandbox.stub();

    nock('https://auth.sitecorecloud.io')
      .post('/oauth/token')
      .reply(200, function(_, __, cb) {
        fetchBearerTokenSpy();
        return cb(null, {
          access_token: 'test-token',
          expires_in: 3600,
          token_type: 'Bearer',
        });
      });

    const consoleLogStub = sandbox.stub(console, 'log');

    nock(constants.SITECORE_EDGE_URL_DEFAULT)
      .post('/api/v1/mesh')
      .reply(200)
      .persist();

    const component1Path = path.resolve(
      process.cwd(),
      './src/codegen/test-data/extract-components/regular-imports/src/components/TestComponent.tsx'
    );

    const component2Path = path.resolve(
      process.cwd(),
      './src/codegen/test-data/extract-components/regular-imports/src/components/TestComponent2.tsx'
    );

    const extractComponentsCall = extractComponents(args);
    await extractComponentsCall();

    expect(fetchBearerTokenSpy.calledOnce).to.be.true;

    expect(consoleLogStub.callCount).to.equal(2);

    expect(consoleLogStub.getCall(0).args[0]).to.equal(
      chalk.green(`Code from ${component1Path} extracted and sent to mesh endpoint`)
    );

    expect(consoleLogStub.getCall(1).args[0]).to.equal(
      chalk.green(`Code from ${component2Path} extracted and sent to mesh endpoint`)
    );
  });
});
