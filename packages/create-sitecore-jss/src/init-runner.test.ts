/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import chalk from 'chalk';
import path, { sep } from 'path';
import { Initializer, InitializerResults } from './common/base/Initializer';
import { InitializerFactory } from './InitializerFactory';
import { initRunner } from './init-runner';
import * as helpers from './common/utils/helpers';
import * as install from './common/processes/install';
import * as next from './common/processes/next';

chai.use(sinonChai);

describe('initRunner', () => {
  let log: SinonStub;
  let installPackagesStub: SinonStub;
  let lintFixStub: SinonStub;
  let nextStepsStub: SinonStub;
  let saveConfigurationStub: SinonStub;
  let createStub: SinonStub;

  const mockInitializer = (results: InitializerResults) => {
    const mock = <Initializer>{};
    mock.init = sinon.stub().returns(results);
    return mock;
  };

  beforeEach(() => {
    log = sinon.stub(console, 'log');
    installPackagesStub = sinon.stub(install, 'installPackages');
    lintFixStub = sinon.stub(install, 'lintFix');
    nextStepsStub = sinon.stub(next, 'nextSteps');
    saveConfigurationStub = sinon.stub(helpers, 'saveConfiguration');
  });

  afterEach(() => {
    log?.restore();
    installPackagesStub?.restore();
    lintFixStub?.restore();
    nextStepsStub?.restore();
    saveConfigurationStub?.restore();
    createStub?.restore();
  });

  it('should run', async () => {
    const template = 'foo';
    const appName = 'test-app';
    const args = {
      silent: false,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer({ appName });
    createStub = sinon.stub(InitializerFactory.prototype, 'create');
    createStub.withArgs('foo').returns(mockFoo);

    await initRunner(template, args);

    expect(log.getCalls().length).to.equal(1);
    expect(log.getCall(0).args[0]).to.equal(chalk.cyan(`Initializing '${template}'...`));
    expect(mockFoo.init).to.be.calledOnceWith(args);
    expect(saveConfigurationStub).to.be.calledOnceWith(
      template,
      path.resolve(`${args.destination}${sep}package.json`)
    );
    expect(installPackagesStub).to.be.calledOnceWith(args.destination, args.silent);
    expect(lintFixStub).to.be.calledOnceWith(args.destination, args.silent);
    expect(nextStepsStub).to.be.calledOnceWith(appName, []);
  });

  it('should process nextSteps', async () => {
    const template = 'foo';
    const appName = 'test-app';
    const args = {
      silent: false,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer({ appName, nextSteps: ['foo step 1', 'foo step 2'] });
    createStub = sinon.stub(InitializerFactory.prototype, 'create');
    createStub.withArgs('foo').returns(mockFoo);

    await initRunner(template, args);

    expect(nextStepsStub).to.be.calledOnceWith(appName, ['foo step 1', 'foo step 2']);
  });

  it('should respect silent', async () => {
    const template = 'foo';
    const appName = 'test-app';
    const args = {
      silent: true,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer({ appName });
    createStub = sinon.stub(InitializerFactory.prototype, 'create');
    createStub.withArgs('foo').returns(mockFoo);

    await initRunner(template, args);

    expect(log).to.not.have.been.called;
    expect(installPackagesStub).to.be.calledOnceWith(args.destination, args.silent);
    expect(lintFixStub).to.be.calledOnceWith(args.destination, args.silent);
    expect(nextStepsStub).to.not.have.been.called;
  });

  it('should respect noInstall', async () => {
    const template = 'foo';
    const appName = 'test-app';
    const args = {
      silent: false,
      noInstall: true,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer({ appName });
    createStub = sinon.stub(InitializerFactory.prototype, 'create');
    createStub.withArgs('foo').returns(mockFoo);

    await initRunner(template, args);

    expect(installPackagesStub).to.not.have.been.called;
    expect(lintFixStub).to.not.have.been.called;
  });

  it('should throw range error if unknown template', async () => {
    const template = 'nope';
    const args = {
      silent: false,
      destination: 'samples/next',
      template,
    };

    createStub = sinon.stub(InitializerFactory.prototype, 'create');
    createStub.returns(undefined);

    await initRunner(template, args).catch((error) => {
      expect(error).to.be.instanceOf(RangeError);
    });
  });
});
