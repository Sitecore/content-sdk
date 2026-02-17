/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import * as templatingUtils from '../templating/utils';

describe('writeImportMap', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
    // Clean up require cache after each test
    delete require.cache[require.resolve('./import-map')];
  });

  it('should pass correct configuration object for App Router', () => {
    let capturedArgs: any;

    sandbox.stub(templatingUtils, 'detectRouterType').returns('app');

    delete require.cache[require.resolve('./import-map')];
    const importMapModule = require('./import-map');
    const { writeImportMap } = importMapModule;

    // Mock the core implementation to capture the arguments
    const mockCoreImpl = (args: any) => {
      capturedArgs = args;
      return () => Promise.resolve();
    };

    importMapModule.__mockDependencies({ writeImportMapCore: mockCoreImpl });

    const args = {
      paths: ['src/components/**/*.tsx'],
      exclude: ['**/*.test.tsx'],
    };

    writeImportMap(args);

    // Verify the captured configuration object
    expect(capturedArgs).to.exist;
    expect(capturedArgs.paths).to.deep.equal(args.paths);
    expect(capturedArgs.exclude).to.deep.equal(args.exclude);
    expect(capturedArgs.separateServerClientMaps).to.be.true;
    expect(capturedArgs.defaultTemplate).to.equal(templatingUtils.nextjsServertMapTemplate);
    expect(capturedArgs.clientTemplate).to.equal(templatingUtils.nextjsClientMapTemplate);
  });

  it('should pass correct configuration object for Pages Router', () => {
    let capturedArgs: any;

    sandbox.stub(templatingUtils, 'detectRouterType').returns('pages');

    delete require.cache[require.resolve('./import-map')];
    const importMapModule = require('./import-map');
    const { writeImportMap } = importMapModule;

    // Mock the core implementation to capture the arguments
    const mockCoreImpl = (args: any) => {
      capturedArgs = args;
      return () => Promise.resolve();
    };

    importMapModule.__mockDependencies({ writeImportMapCore: mockCoreImpl });

    const args = {
      paths: ['src/pages/**/*.tsx'],
      exclude: ['**/*.test.tsx'],
    };

    writeImportMap(args);

    // Verify the captured configuration object
    expect(capturedArgs).to.exist;
    expect(capturedArgs.paths).to.deep.equal(args.paths);
    expect(capturedArgs.exclude).to.deep.equal(args.exclude);
    expect(capturedArgs.separateServerClientMaps).to.be.false;
    expect(capturedArgs.defaultTemplate).to.equal(templatingUtils.nextjsDefaultMapTemplate);
    expect(capturedArgs.clientTemplate).to.equal(templatingUtils.nextjsClientMapTemplate);
  });
});
