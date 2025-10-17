/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import * as generateMapModule from './generate-map';
import * as loadConfigModule from '../../../utils/load-config';
import * as watchItemsModule from '../../../utils/watch-items';

describe('generate-map CLI', () => {
  let sandbox: sinon.SinonSandbox;
  let consoleErrorStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let loadCliConfigStub: sinon.SinonStub;
  let watchItemsStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    consoleErrorStub = sandbox.stub(console, 'error');
    consoleLogStub = sandbox.stub(console, 'log');
    loadCliConfigStub = sandbox.stub(loadConfigModule, 'default');
    watchItemsStub = sandbox.stub(watchItemsModule, 'watchItems');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should console.error and return when generateMap is not configured in sitecore cli config', () => {
    loadCliConfigStub.returns({});
    generateMapModule.handler({});
    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.match(
      /The `sitecore.cli.config` file is missing a `componentMap` configuration. Please add it to use this command./
    );
  });

  it('should use custom config when provided', () => {
    const fakeConfig = {
      componentMap: {
        generator: sinon.stub(),
        paths: ['src'],
        destination: 'dest',
        componentImports: [],
        exclude: [],
      },
    };
    loadCliConfigStub.withArgs('custom-config.js').returns(fakeConfig);
    generateMapModule.handler({ config: 'custom-config.js' });
    expect(loadCliConfigStub.calledWith('custom-config.js')).to.be.true;
  });

  it('should launch watch function when watch is true', () => {
    const generatorStub = sinon.stub();
    const fakeConfig = {
      componentMap: {
        generator: generatorStub,
        paths: ['src'],
        destination: 'dest',
        componentImports: [],
        exclude: [],
      },
    };
    loadCliConfigStub.returns(fakeConfig);
    generateMapModule.handler({ watch: true });
    expect(watchItemsStub.calledOnce).to.be.true;
    expect(watchItemsStub.firstCall.args[0]).to.deep.equal(['src']);
    expect(consoleLogStub.calledWithMatch(/Watching for component changes/)).to.be.true;
  });

  it('should launch component map generator with args from cli config', () => {
    const generatorStub = sinon.stub();
    const args = {
      paths: ['src'],
      destination: 'dest',
      componentImports: ['pkg'],
      exclude: ['ex'],
      clientComponentMap: undefined,
      enableVariantsInMap: undefined,
    };
    const fakeConfig = {
      componentMap: {
        generator: generatorStub,
        ...args,
      },
    };
    loadCliConfigStub.returns(fakeConfig);
    generateMapModule.handler({});
    expect(generatorStub.calledOnce).to.be.true;
    expect(generatorStub.firstCall.args[0]).to.deep.equal(args);
    expect(consoleLogStub.calledWithMatch(/Generating component map/)).to.be.true;
  });

  it('should pass clientComponentMap: false to generator when explicitly set to false', () => {
    const generatorStub = sinon.stub();
    const args = {
      paths: ['src'],
      destination: 'dest',
      componentImports: ['pkg'],
      exclude: ['ex'],
      clientComponentMap: false,
    };
    const fakeConfig = {
      componentMap: {
        generator: generatorStub,
        ...args,
      },
    };
    loadCliConfigStub.returns(fakeConfig);
    generateMapModule.handler({});
    expect(generatorStub.calledOnce).to.be.true;
    expect(generatorStub.firstCall.args[0]).to.deep.equal(args);
    expect(generatorStub.firstCall.args[0].clientComponentMap).to.be.false;
    expect(consoleLogStub.calledWithMatch(/Generating component map/)).to.be.true;
  });
});
