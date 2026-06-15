/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import * as loadConfigModule from '../../utils/load-config';
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
    sinon.stub(fs, 'existsSync').returns(true);
    sinon.stub(fs, 'mkdirSync');
    sinon.stub(process, 'exit');
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

  it('should create the .sitecore directory before executing build commands', async () => {
    (fs.existsSync as sinon.SinonStub).returns(false);

    await handler({});

    const outputPath = path.resolve(process.cwd(), '.sitecore');
    expect((fs.existsSync as sinon.SinonStub).calledWith(outputPath)).to.be.true;
    expect((fs.mkdirSync as sinon.SinonStub).calledOnceWithExactly(outputPath, {
      recursive: true,
    })).to.be.true;
    expect(mockConfig.build.commands[0].calledAfter(fs.mkdirSync as sinon.SinonStub)).to.be.true;
  });
});
