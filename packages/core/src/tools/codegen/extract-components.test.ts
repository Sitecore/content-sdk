import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import fs from 'fs';
import { extractComponents } from './extract-components';
import { getFallbackConfig } from '../../config/define-config';
import nock from 'nock';
import { SITECORE_EDGE_URL_DEFAULT } from '../../constants';
import path from 'path';

describe('extract-components', () => {
  const sandbox = sinon.createSandbox();
  const defaultConfig = getFallbackConfig();

  const mockArgs = {
    scConfig: {
      ...defaultConfig,
      api: {
        ...defaultConfig.api,
        edge: {
          ...defaultConfig.api.edge,
        },
        m2m: {
          ...defaultConfig.api.m2m,
          clientId: 'test-client-id',
          secret: 'test-client-secret',
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

    await extractComponents(mockArgs);

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red('Failed to get bearer token, aborting code extraction')
    );
  });

  it('should catch exceptions from resolveImportFiles call', async () => {
    const args = {
      ...mockArgs,
      appFolder: './src/tools/codegen/test-data/extract-components/no-componentBuilder',
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

    await extractComponents(args);

    expect(fetchBearerTokenSpy.calledOnce).to.be.true;
    expect(consoleErrorStub.calledOnce).to.be.true;
    const expectedPath = path.resolve(
      process.cwd(),
      './src/tools/codegen/test-data/extract-components/no-componentBuilder/src/lib/componentMap.ts'
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
      appFolder: './src/tools/codegen/test-data/extract-components/regular-imports',
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
    // const consoleErrorStub = sandbox.stub(console, 'error');

    const consoleLogStub = sandbox.stub(console, 'log');

    nock(SITECORE_EDGE_URL_DEFAULT)
      .post('/api/v1/mesh')
      .reply(200)
      .persist();

    const component1Path = path.resolve(
      process.cwd(),
      './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent.tsx'
    );

    const component2Path = path.resolve(
      process.cwd(),
      './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent2.tsx'
    );

    await extractComponents(args);

    expect(fetchBearerTokenSpy.calledOnce).to.be.true;

    // expect(consoleErrorStub.called).to.be.false;

    expect(consoleLogStub.callCount).to.equal(2);

    expect(consoleLogStub.getCall(0).args[0]).to.equal(
      chalk.green(`Code from ${component1Path} extracted and sent to mesh endpoint`)
    );

    expect(consoleLogStub.getCall(1).args[0]).to.equal(
      chalk.green(`Code from ${component2Path} extracted and sent to mesh endpoint`)
    );
  });
});
