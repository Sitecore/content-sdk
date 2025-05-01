import { expect } from 'chai';
import sinon from 'sinon';
import * as loadConfigModule from '../utils/load-config';
import { handler } from './build';

describe('build command', () => {
  let loadCliConfigStub: sinon.SinonStub;
  let mockConfig: any;

  beforeEach(() => {
    mockConfig = {
      build: {
        commands: [sinon.stub(), sinon.stub()],
      },
    };
    loadCliConfigStub = sinon.stub(loadConfigModule, 'default').returns(mockConfig);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call the loadConfig passing the config arg', async () => {
    const argv = { config: './some-config.ts' };
    await handler(argv);
    expect(loadCliConfigStub.calledOnceWith(argv.config)).to.be.true;
  });

  it('should execute all build commands', async () => {
    const argv = { config: './some-config.ts' };
    await handler(argv);
    mockConfig.build.commands.forEach((command: sinon.SinonStub) => {
      expect(command.calledOnce).to.be.true;
    });
  });
});
