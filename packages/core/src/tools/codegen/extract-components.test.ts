import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import { extractComponents } from './extract-components';
import * as cliUtils from './utils';
import * as authUtils from '../auth/fetch-bearer-token';
import { getFallbackConfig } from '../../config/define-config';
import proxyquire from 'proxyquire';

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
  });

  afterEach(() => {
    sandbox.restore();
    delete process.env.EXTRACT_CONSENT;
    delete process.env.SITECORE;
    delete process.env.BuildMetadata_BuildId;
  });

  // TODO: fix proxyquire and mocks here (why do they never work?)

  it('should log when bearer is empty', async () => {
    const consoleErrorStub = sandbox.stub(console, 'error');
    const resolveImportFilesStub = sandbox.stub().resolves(['/path/to/component.ts']);
    const fetchBearerTokenStub = sandbox.stub().resolves('');
    proxyquire('./extract-components', {
      './utils': {
        ...cliUtils,
        resolveComponentImportFiles: resolveImportFilesStub,
      },
      '../auth/fetch-bearer-token': {
        ...authUtils,
        fetchBearerToken: fetchBearerTokenStub,
      },
    });

    await extractComponents(mockArgs);

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red('Failed to get bearer token, aborting code extraction')
    );
  });

  xit('should catch exceptions from resolveImportFiles call', async () => {
    const consoleErrorStub = sandbox.stub(console, 'error');
    const resolveImportFilesStub = sandbox.stub().throws(new Error('oopsie'));
    const fetchBearerTokenStub = sandbox.stub().resolves('test-token');
    proxyquire('./extract-components', {
      './utils': {
        ...cliUtils,
        resolveComponentImportFiles: resolveImportFilesStub,
      },
      '../auth/fetch-bearer-token': {
        ...authUtils,
        fetchBearerToken: fetchBearerTokenStub,
      },
    });

    await extractComponents(mockArgs);

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      chalk.red('Error during component extraction: Error: oopsie')
    );
  });

  xit('should call sendCode for each component path', async () => {
    const componentMap = new Map([
      ['component1', '/path/to/component1.ts'],
      ['component2', '/path/to/component2.ts'],
    ]);
    const sendCodeStub = sandbox.stub().resolves();
    const fetchBearerTokenStub = sandbox.stub().resolves('test-token');
    const resolveImportFilesStub = sandbox.stub().resolves(componentMap);

    proxyquire('./extract-components', {
      './utils': {
        ...cliUtils,
        resolveComponentImportFiles: resolveImportFilesStub,
        sendCode: sendCodeStub,
      },
      '../auth/fetch-bearer-token': {
        ...authUtils,
        fetchBearerToken: fetchBearerTokenStub,
      },
    });

    await extractComponents(mockArgs);

    expect(resolveImportFilesStub.calledOnce).to.be.true;
    expect(sendCodeStub.callCount).to.equal(2);
  });
});
