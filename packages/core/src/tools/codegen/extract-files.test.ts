/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import fs from 'fs';
import nock from 'nock';
import path from 'path';
import { defineConfig } from './../../config';
import { auth } from '../../tools';
import { extractFiles, ExtractFilesConfig } from './extract-files';
import debug from './../../debug';

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

  const initialization = [
    {
      title: 'Using deprecated scConfig',
      run: (config: ExtractFilesConfig) => {
        const generate = extractFiles(config);
        return generate();
      },
    },
    {
      title: 'Using new config passed as argument',
      run: ({ scConfig, ...rest }: ExtractFilesConfig) => {
        const generate = extractFiles(rest);
        return generate({ scConfig });
      },
    },
  ];

  initialization.forEach(({ title, run }) => {
    describe(title, () => {
      it('should skip when not in deploy context', async () => {
        const debugStub = sandbox.stub(debug, 'common');
        const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: '' });
        sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

        delete process.env.SITECORE;
        delete process.env.SITECORE_AUTH_CLIENT_ID;
        delete process.env.SITECORE_AUTH_CLIENT_SECRET;
        delete process.env.SITECORE_BUILD;

        await run(mockArgs);

        expect(debugStub.calledOnce).to.be.true;
        expect(debugStub.firstCall.args[0]).to.equal(
          'Skipping code extraction, not in deploy context'
        );
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

        await run(args);

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

        await run(args);

        expect(debugStub.calledOnce).to.be.true;
        expect(debugStub.firstCall.args[0]).to.equal(
          'Skipping code extraction, not in deploy context'
        );
      });

      it('should log when access token is empty', async () => {
        const consoleErrorStub = sandbox.stub(console, 'error');
        const fetchBearerTokenStub = sandbox.stub().resolves({ data: {}, accessToken: '' });
        sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

        await run(mockArgs);

        expect(consoleErrorStub.calledOnce).to.be.true;
        expect(consoleErrorStub.firstCall.args[0]).to.equal(
          chalk.red('Failed to get access token, aborting code extraction')
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

        const fetchBearerTokenStub = sandbox
          .stub()
          .resolves({ data: {}, accessToken: 'test-token' });
        sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

        const consoleErrorStub = sandbox.stub(console, 'error');

        await run(args);

        expect(fetchBearerTokenStub.calledOnce).to.be.true;
        expect(consoleErrorStub.calledOnce).to.be.true;
        const expectedPath = path.resolve(process.cwd(), './.sitecore/component-map.ts');
        expect(consoleErrorStub.firstCall.args[0]).to.equal(
          chalk.red(
            'Error during code extraction: ReferenceError: Failed to find file',
            expectedPath
          )
        );
      });

      it('should call sendCode for each component path and package.json', async () => {
        const appFolder = path.resolve(
          process.cwd(),
          './src/tools/codegen/test-data/extract-components/regular-imports'
        );
        sandbox.stub(process, 'cwd').returns(appFolder);

        const fetchBearerTokenStub = sandbox
          .stub()
          .resolves({ data: {}, accessToken: 'test-token' });
        sandbox.replaceGetter(auth, 'clientCredentialsFlow', () => fetchBearerTokenStub);

        const consoleLogStub = sandbox.stub(console, 'log');

        nock(edgeUrl).post('/mesh/push/api/v1/contentsdk/code/extracted').reply(200).persist();

        const component1Path = path.resolve(process.cwd(), './src/components/TestComponent.tsx');
        const component2Path = path.resolve(process.cwd(), './src/components/TestComponent2.tsx');
        const packageJsonPath = path.resolve(process.cwd(), './package.json');

        await run(mockArgs);

        expect(fetchBearerTokenStub.calledOnce).to.be.true;

        const msgs = consoleLogStub.getCalls().map((c) => c.args[0]);
        expect(msgs).to.include(chalk.green('Code extraction started'));

        const successMsg = chalk.green(
          [
            'Code extraction completed successfully, files extracted:',
            component1Path,
            component2Path,
            packageJsonPath,
          ].join('\r\n')
        );
        expect(msgs).to.include(successMsg);
      });
    });
  });
});
