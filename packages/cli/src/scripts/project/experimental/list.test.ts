/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG } from '@sitecore-content-sdk/content/experimental';
import * as frameworkPackage from '../../../utils/framework-package';
import { handler } from './list';

describe('experimental list command', () => {
  const frameworkPackageName = '@sitecore-content-sdk/nextjs';

  const catalog = [
    {
      idName: 'dummy-feature',
      displayName: 'Dummy Feature',
      envVarName: 'CSDK_EXPERIMENTAL_DUMMY_FEATURE',
      description: 'Sample experimental feature.',
    },
  ];

  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let resolveFrameworkPackageNameStub: sinon.SinonStub;
  let loadAppModuleStub: sinon.SinonStub;

  const output = () =>
    consoleLogStub
      .getCalls()
      .map((call) => call.args[0])
      .join('\n');

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
    resolveFrameworkPackageNameStub = sinon
      .stub(frameworkPackage, 'resolveFrameworkPackageName')
      .returns(frameworkPackageName);
    loadAppModuleStub = sinon
      .stub(frameworkPackage, 'loadAppModule')
      .returns({ experimentalFeaturesCatalog: catalog });
    delete process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG];
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
  });

  afterEach(() => {
    sinon.restore();
    delete process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG];
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
  });

  it('should report an error when the app is not a Content SDK app', () => {
    resolveFrameworkPackageNameStub.returns(undefined);

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.include('Content SDK app not found');
    expect(loadAppModuleStub.notCalled).to.be.true;
  });

  it('should lazy load the catalog from the framework package', () => {
    handler();

    expect(loadAppModuleStub.calledOnceWith(`${frameworkPackageName}/experimental`)).to.be.true;
  });

  it('should report an error when the framework package cannot be loaded', () => {
    loadAppModuleStub.throws(new Error('Cannot find module'));

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.include('Cannot find module');
  });

  it('should report an error when the framework package exposes no catalog', () => {
    loadAppModuleStub.returns({});

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.include('does not report experimental features');
  });

  it('should report a friendly message when the catalog is empty', () => {
    loadAppModuleStub.returns({ experimentalFeaturesCatalog: [] });

    handler();

    expect(consoleErrorStub.notCalled).to.be.true;
    expect(output()).to.include(
      `There are no experimental features available in ${frameworkPackageName}.`
    );
  });

  it('should list the features as disabled when no environment variable is set', () => {
    handler();

    const logged = output();

    expect(consoleErrorStub.notCalled).to.be.true;
    expect(logged).to.include(`Experimental features available in ${frameworkPackageName}:`);
    expect(logged).to.include('Dummy Feature (dummy-feature)');
    expect(logged).to.include('Status:               disabled');
    expect(logged).to.include('Environment variable: CSDK_EXPERIMENTAL_DUMMY_FEATURE');
    expect(logged).to.include('Sample experimental feature.');
    expect(logged).to.include(`${CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG}="true"`);
  });

  it('should list a feature as enabled when its environment variable is set', () => {
    process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE = 'true';

    handler();

    expect(output()).to.include('Status:               enabled');
  });

  it('should report when all features are enabled by the global flag', () => {
    process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG] = 'true';

    handler();

    const logged = output();

    expect(logged).to.include('Status:               enabled');
    expect(logged).to.include(
      `All experimental features are enabled because ${CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG} is set to "true".`
    );
  });
});
