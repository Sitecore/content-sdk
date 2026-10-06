/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { Question } from 'inquirer';
import { ScaffoldInitData } from '@sitecore-content-sdk/cli/scaffolding';
import * as initialize from './initialize';
import * as registry from './registry';
import * as helpers from './common/utils/helpers';
import * as install from './common/processes/install';
import * as next from './common/processes/next';
import * as transformModule from './common/processes/transform';

const { initialize: initializeFunc } = initialize;

chai.use(sinonChai);

describe('initialize', () => {
  let log: SinonStub;
  let promptStub: SinonStub;
  let transformStub: SinonStub;
  let installPackagesStub: SinonStub;
  let lintFixStub: SinonStub;
  let nextStepsStub: SinonStub;
  let openJsonFileStub: SinonStub;
  let getInitializerStub: SinonStub;

  const defaultAppName = 'content-sdk-foo-app';

  // Template packages now export plain data (ScaffoldInitData) rather than an
  // initializer with an `init()` method — the CLI drives prompting + transform.
  const mockInitializer = (
    overrides: Partial<ScaffoldInitData<Question>> = {}
  ): ScaffoldInitData<Question> => ({
    name: 'foo',
    prompts: [],
    templatePath: 'templates/foo',
    versions: {},
    ...overrides,
  });

  beforeEach(() => {
    log = sinon.stub(console, 'log');
    promptStub = sinon.stub(inquirer, 'prompt').resolves({} as never);
    transformStub = sinon.stub(transformModule, 'transform').resolves();
    installPackagesStub = sinon.stub(install, 'installPackages');
    lintFixStub = sinon.stub(install, 'lintFix');
    nextStepsStub = sinon.stub(next, 'nextSteps');
    getInitializerStub = sinon.stub(registry, 'getInitializerData');
    openJsonFileStub = sinon.stub(helpers, 'openJsonFile').returns({ name: defaultAppName });
  });

  afterEach(() => {
    log?.restore();
    promptStub?.restore();
    transformStub?.restore();
    installPackagesStub?.restore();
    lintFixStub?.restore();
    nextStepsStub?.restore();
    getInitializerStub?.restore();
    openJsonFileStub?.restore();
  });

  it('should run', async () => {
    const template = 'foo';
    const args = {
      silent: false,
      destination: 'samples/next',
      template,
    };

    const mockFoo = mockInitializer();
    getInitializerStub.withArgs('foo').resolves(mockFoo);

    await initializeFunc(template, args);

    expect(log.getCalls().length).to.equal(1);
    expect(log.getCall(0).args[0]).to.equal(chalk.cyan(`Initializing '${template}'...`));
    // the CLI renders the template package's folder with its bound versions
    expect(transformStub).to.be.calledOnce;
    expect(transformStub.getCall(0).args[0]).to.equal(mockFoo.templatePath);
    expect(transformStub.getCall(0).args[2]).to.deep.equal(mockFoo.versions);
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
    getInitializerStub.withArgs('foo').resolves(mockFoo);

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

    const mockFoo = mockInitializer();
    getInitializerStub.withArgs('foo').resolves(mockFoo);

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

    const mockFoo = mockInitializer();
    getInitializerStub.withArgs('foo').resolves(mockFoo);

    await initializeFunc(template, args);

    expect(installPackagesStub).to.not.have.been.called;
    expect(lintFixStub).to.not.have.been.called;
  });
});

