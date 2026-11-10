import fs from 'fs';
import { expect } from 'chai';
import sinon from 'sinon';
import cli from './cli';
import * as commands from './scripts';
import * as telemetry from './telemetry/track';
import * as loadConfigModule from './utils/load-config';

describe('cli options', () => {
  const originalArgv = process.argv.slice();

  beforeEach(() => {
    sinon.stub(loadConfigModule, 'default').returns({
      build: { commands: [] },
      config: {},
    } as any);
    sinon.stub(telemetry, 'trackCliCommandRun').resolves();
    sinon.stub(telemetry, 'trackAppBuilt').resolves();
    sinon.stub(fs, 'existsSync').returns(true);
    sinon.stub(fs, 'mkdirSync');
    sinon.stub(process, 'exit');
  });

  afterEach(() => {
    process.argv = originalArgv;
    sinon.restore();
  });

  it('passes --noTelemetry to the command event and the build event', async () => {
    process.argv = ['node', 'sitecore-tools', 'project', 'build', '--noTelemetry'];

    await cli(commands);

    const commandEvent = (telemetry.trackCliCommandRun as sinon.SinonStub).firstCall.args[0];
    const buildEvent = (telemetry.trackAppBuilt as sinon.SinonStub).firstCall.args[0];
    expect(commandEvent).to.deep.equal({
      commandName: 'project build',
      noTelemetry: true,
    });
    expect(buildEvent.noTelemetry).to.equal(true);
    expect(buildEvent.success).to.equal(true);
  });

  it('leaves telemetry on when the flag is omitted', async () => {
    process.argv = ['node', 'sitecore-tools', 'project', 'build'];

    await cli(commands);

    expect(
      (telemetry.trackCliCommandRun as sinon.SinonStub).firstCall.args[0].noTelemetry
    ).to.equal(false);
    expect(
      (telemetry.trackAppBuilt as sinon.SinonStub).firstCall.args[0].noTelemetry
    ).to.equal(undefined);
  });
});
