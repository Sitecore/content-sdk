import { expect } from 'chai';
import sinon from 'sinon';
import * as td from 'testdouble';

describe('build command', () => {
  let loadCliConfigStub: sinon.SinonStub;
  let mockConfig: any;
  let buildModule: typeof import('./build.js');

  beforeEach(async () => {
    mockConfig = {
      build: {
        commands: [sinon.stub(), sinon.stub()],
      },
    };

    loadCliConfigStub = sinon.stub().resolves(mockConfig);
    await td.replaceEsm('../../utils/load-config.ts', undefined, loadCliConfigStub);
    buildModule = await import('./build.js');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call the loadConfig passing the config arg', async () => {
    const argv = { config: './some-config.ts' };
    await buildModule.handler(argv);
    expect(loadCliConfigStub.calledOnceWith(argv.config)).to.be.true;
  });

  it('should execute all build commands', async () => {
    const argv = { config: './some-config.ts' };
    await buildModule.handler(argv);
    mockConfig.build.commands.forEach((command: sinon.SinonStub) => {
      expect(command.calledOnce).to.be.true;
    });
  });
});
