/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import chalk from 'chalk';
import path, { sep } from 'path';
import { Initializer, InitializerResults } from './common/base/Initializer';
import * as initialize from './initialize';
import * as helpers from './common/utils/helpers';
import * as install from './common/processes/install';
import * as next from './common/processes/next';

const { getInitializer, initialize: initializeFunc } = initialize;

chai.use(sinonChai);

describe('initialize', () => {
  let log: SinonStub;
  let installPackagesStub: SinonStub;
  let lintFixStub: SinonStub;
  let nextStepsStub: SinonStub;
  let saveConfigurationStub: SinonStub;
  let getInitializerStub: SinonStub;

  const defaultAppName = 'jss-foo-app';

  const mockInitializer = (results: Partial<InitializerResults>) => {
    const mock = <Initializer>{};
    results.appName = defaultAppName;
    mock.init = sinon.stub().returns(results);
    return mock;
  };

  beforeEach(() => {
    log = sinon.stub(console, 'log');
    installPackagesStub = sinon.stub(install, 'installPackages');
    lintFixStub = sinon.stub(install, 'lintFix');
    nextStepsStub = sinon.stub(next, 'nextSteps');
    saveConfigurationStub = sinon.stub(helpers, 'saveConfiguration');
    getInitializerStub = sinon.stub(initialize, 'getInitializer');
  });

  afterEach(() => {
    log?.restore();
    installPackagesStub?.restore();
    lintFixStub?.restore();
    nextStepsStub?.restore();
    saveConfigurationStub?.restore();
    getInitializerStub?.restore();
  });

  it('should run', async () => {
    const template = 'foo';
    const args = {
      silent: false,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer({});
    getInitializerStub.withArgs('foo').returns(mockFoo);

    await initializeFunc(template, args);

    expect(log.getCalls().length).to.equal(1);
    expect(log.getCall(0).args[0]).to.equal(chalk.cyan(`Initializing '${template}'...`));
    expect(mockFoo.init).to.be.calledOnceWith(args);
    expect(saveConfigurationStub).to.be.calledOnceWith(
      template,
      path.resolve(`${args.destination}${sep}package.json`)
    );
    expect(installPackagesStub).to.be.calledOnceWith(args.destination, args.silent);
    expect(lintFixStub).to.be.calledOnceWith(args.destination, args.silent);
    expect(nextStepsStub).to.be.calledOnceWith(defaultAppName, undefined);
  });

  it('should process nextSteps', async () => {
    const template = 'foo';
    const args = {
      silent: false,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer({ nextSteps: 'foo next step' });
    getInitializerStub.withArgs('foo').returns(mockFoo);

    await initializeFunc(template, args);

    expect(nextStepsStub).to.be.calledOnceWith(defaultAppName, 'foo next step');
  });

  it('should respect silent', async () => {
    const template = 'foo';
    const args = {
      silent: true,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer({});
    getInitializerStub.withArgs('foo').returns(mockFoo);

    await initializeFunc(template, args);

    expect(log).to.not.have.been.called;
    expect(installPackagesStub).to.be.calledOnceWith(args.destination, args.silent);
    expect(lintFixStub).to.be.calledOnceWith(args.destination, args.silent);
    expect(nextStepsStub).to.not.have.been.called;
  });

  it('should respect noInstall', async () => {
    const template = 'foo';
    const args = {
      silent: false,
      noInstall: true,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer({});
    getInitializerStub.withArgs('foo').returns(mockFoo);

    await initializeFunc(template, args);

    expect(installPackagesStub).to.not.have.been.called;
    expect(lintFixStub).to.not.have.been.called;
  });
});

describe('getInitializer', () => {
  it('should return initializer', async () => {
    const initializer = await getInitializer('./../../src/common/test-data/initializers/test');

    expect(initializer).to.not.be.undefined;
    expect(initializer?.constructor.name).to.equal('TestInitializer');
  });
});
