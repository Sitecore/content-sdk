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
  let resolveContentSdkPackageNamesStub: sinon.SinonStub;
  let loadAppModuleStub: sinon.SinonStub;
  let canResolveAppModuleStub: sinon.SinonStub;

  const output = () =>
    consoleLogStub
      .getCalls()
      .map((call) => call.args[0])
      .join('\n');

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
    resolveContentSdkPackageNamesStub = sinon
      .stub(frameworkPackage, 'resolveContentSdkPackageNames')
      .returns([frameworkPackageName]);
    loadAppModuleStub = sinon
      .stub(frameworkPackage, 'loadAppModule')
      .returns({ experimentalFeaturesCatalog: catalog });
    canResolveAppModuleStub = sinon.stub(frameworkPackage, 'canResolveAppModule').returns(true);
    delete process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG];
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
  });

  afterEach(() => {
    sinon.restore();
    delete process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG];
    delete process.env.CSDK_EXPERIMENTAL_DUMMY_FEATURE;
  });

  it('should report an error when the app is not a Content SDK app', () => {
    resolveContentSdkPackageNamesStub.returns(undefined);

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.include('Content SDK app not found');
    expect(loadAppModuleStub.notCalled).to.be.true;
  });

  it('should report an error when the app has no Content SDK packages', () => {
    resolveContentSdkPackageNamesStub.returns([]);

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
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      `Failed to read the experimental features of ${frameworkPackageName}. Make sure the app dependencies are installed. Cannot find module`
    );
  });

  it('should skip an installed package that has no experimental file', () => {
    resolveContentSdkPackageNamesStub.returns(['@sitecore-content-sdk/cli', frameworkPackageName]);
    loadAppModuleStub.callsFake((specifier: string) => {
      if (specifier === '@sitecore-content-sdk/cli/experimental') {
        throw Object.assign(
          new Error("Cannot find module '@sitecore-content-sdk/cli/experimental'"),
          { code: 'MODULE_NOT_FOUND' }
        );
      }

      return { experimentalFeaturesCatalog: catalog };
    });

    handler();

    expect(consoleErrorStub.notCalled).to.be.true;
    expect(output()).to.include(`Experimental features available in ${frameworkPackageName}:`);
    expect(canResolveAppModuleStub.calledWith('@sitecore-content-sdk/cli')).to.be.true;
  });

  it('should report an install error when the package itself cannot be resolved', () => {
    canResolveAppModuleStub.returns(false);
    loadAppModuleStub.throws(
      Object.assign(new Error(`Cannot find module '${frameworkPackageName}/experimental'`), {
        code: 'MODULE_NOT_FOUND',
      })
    );

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.include('dependencies are installed');
    expect(consoleErrorStub.firstCall.args[0]).to.include(frameworkPackageName);
  });

  it('should include a non-Error thrown value in the load failure message', () => {
    loadAppModuleStub.callsFake(() => {
      throw 'module load failed';
    });

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      `Failed to read the experimental features of ${frameworkPackageName}. Make sure the app dependencies are installed. module load failed`
    );
  });

  it('should report that the current version has no experimental features when the export is missing', () => {
    const error = Object.assign(
      new Error('Package subpath \'./experimental\' is not defined by "exports"'),
      { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' }
    );
    loadAppModuleStub.throws(error);

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      `There are no experimental features present in the current version of ${frameworkPackageName}.`
    );
  });

  it('should report that the current version has no experimental features when no catalog is exported', () => {
    loadAppModuleStub.returns({});

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      `There are no experimental features present in the current version of ${frameworkPackageName}.`
    );
  });

  it('should report an error when the experimental catalog is not an array', () => {
    loadAppModuleStub.returns({ experimentalFeaturesCatalog: { idName: 'not-a-list' } });

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      `The experimental features catalog exported by ${frameworkPackageName} is not an array.`
    );
  });

  it('should report a friendly message when the catalog is empty', () => {
    loadAppModuleStub.returns({ experimentalFeaturesCatalog: [] });

    handler();

    expect(consoleErrorStub.notCalled).to.be.true;
    expect(output()).to.equal(
      `There are no experimental features present in the current version of ${frameworkPackageName}.`
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

  it('should list a catalog from each Content SDK package that exports one', () => {
    resolveContentSdkPackageNamesStub.returns([
      '@sitecore-content-sdk/angular',
      '@sitecore-content-sdk/events',
      frameworkPackageName,
    ]);
    loadAppModuleStub.callsFake((specifier: string) => {
      if (specifier === '@sitecore-content-sdk/events/experimental') {
        throw Object.assign(new Error("Package subpath './experimental' is not defined"), {
          code: 'ERR_PACKAGE_PATH_NOT_EXPORTED',
        });
      }

      if (specifier === '@sitecore-content-sdk/angular/experimental') {
        return {};
      }

      return { experimentalFeaturesCatalog: catalog };
    });

    handler();

    const logged = output();
    const hint = `Set an environment variable to "true" to enable a single feature, or ${CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG}="true" to enable all of them.`;

    expect(consoleErrorStub.notCalled).to.be.true;
    expect(logged).to.include(`Experimental features available in ${frameworkPackageName}:`);
    expect(logged).to.not.include('@sitecore-content-sdk/events');
    expect(logged).to.not.include('@sitecore-content-sdk/angular');
    expect(logged.split(hint)).to.have.length(2);
  });

  it('should report once when none of the installed packages export a catalog', () => {
    resolveContentSdkPackageNamesStub.returns([
      '@sitecore-content-sdk/events',
      frameworkPackageName,
    ]);
    loadAppModuleStub.callsFake(() => {
      throw Object.assign(new Error("Package subpath './experimental' is not defined"), {
        code: 'ERR_PACKAGE_PATH_NOT_EXPORTED',
      });
    });

    handler();

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      'There are no experimental features present in the current version of the installed Content SDK packages.'
    );
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
