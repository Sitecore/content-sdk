import { expect } from 'chai';
import sinon from 'sinon';
import * as td from 'testdouble';

describe('generate-map CLI', () => {
  let sandbox: sinon.SinonSandbox;
  let consoleErrorStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let loadCliConfigStub: sinon.SinonStub;
  let watchItemsStub: sinon.SinonStub;
  let generateMapModule: typeof import('./generate-map.js');

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    consoleErrorStub = sandbox.stub(console, 'error');
    consoleLogStub = sandbox.stub(console, 'log');
    loadCliConfigStub = sandbox.stub();
    watchItemsStub = sandbox.stub();
    await td.replaceEsm('../../../utils/load-config.ts', undefined, loadCliConfigStub);
    await td.replaceEsm('../../../utils/watch-items.ts', {
      watchItems: watchItemsStub,
    });
    generateMapModule = await import('./generate-map.js');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should console.error and return when generateMap is not configured in sitecore cli config', async () => {
    loadCliConfigStub.returns({});
    await generateMapModule.handler({});
    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.match(
      /The `sitecore.cli.config` file is missing a `componentMap` configuration. Please add it to use this command./
    );
  });

  it('should use custom config when provided', async () => {
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
    await generateMapModule.handler({ config: 'custom-config.js' });
    expect(loadCliConfigStub.calledWith('custom-config.js')).to.be.true;
  });

  it('should launch watch function when watch is true', async () => {
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
    await generateMapModule.handler({ watch: true });
    expect(watchItemsStub.calledOnce).to.be.true;
    expect(watchItemsStub.firstCall.args[0]).to.deep.equal(['src']);
    expect(consoleLogStub.calledWithMatch(/Watching for component changes/)).to.be.true;
  });

  it('should launch component map generator with args from cli config', async () => {
    const generatorStub = sinon.stub();
    const args = {
      paths: ['src'],
      destination: 'dest',
      componentImports: ['pkg'],
      exclude: ['ex'],
    };
    const fakeConfig = {
      componentMap: {
        generator: generatorStub,
        ...args,
      },
    };
    loadCliConfigStub.returns(fakeConfig);
    await generateMapModule.handler({});
    expect(generatorStub.calledOnce).to.be.true;
    expect(generatorStub.firstCall.args[0]).to.deep.equal(args);
    expect(consoleLogStub.calledWithMatch(/Generating component map/)).to.be.true;
  });
});
