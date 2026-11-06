import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import sinon from 'sinon';
import { telemetryClient } from '@sitecore-content-sdk/core/node-tools';
import {
  APP_BUILT_EVENT_NAME,
  CLI_COMMAND_EVENT_NAME,
  trackAppBuilt,
  trackCliCommandRun,
} from './track';

describe('cli telemetry events', () => {
  let root: string;
  let dispatch: sinon.SinonStub;
  let log: sinon.SinonStub;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'csdk-cli-event-'));
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'my-app' }));
    sinon.stub(telemetryClient, 'isTelemetryEnabled').returns(true);
    dispatch = sinon.stub(telemetryClient, 'dispatchTelemetryEvent').resolves(true);
    log = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('sends cli_command_run with the command and app name', async () => {
    await trackCliCommandRun({ commandName: 'project build', cwd: root });

    expect(log.calledOnce).to.equal(true);
    expect(dispatch.calledOnce).to.equal(true);
    const event = dispatch.firstCall.args[0];
    expect(event.name).to.equal(CLI_COMMAND_EVENT_NAME);
    expect(event.data.command_name).to.equal('project build');
    expect(event.data.app_name).to.equal('my-app');
    expect(event.data.cli_version).to.be.a('string');
    expect(event.fingerprint.packageName).to.equal('@sitecore-content-sdk/cli');
  });

  it('sends app_built with the result, platform, and enabled features', async () => {
    const previousVercel = process.env.VERCEL;
    process.env.VERCEL = '1';

    try {
      await trackAppBuilt({
        success: false,
        error: new Error('build failed\nline two'),
        config: { multisite: { enabled: true }, personalize: { enabled: false } },
        cwd: root,
      });
    } finally {
      if (previousVercel === undefined) {
        delete process.env.VERCEL;
      } else {
        process.env.VERCEL = previousVercel;
      }
    }

    expect(log.called).to.equal(false);
    const event = dispatch.firstCall.args[0];
    expect(event.name).to.equal(APP_BUILT_EVENT_NAME);
    expect(event.data.success).to.equal(false);
    expect(event.data.platform).to.equal('vercel');
    expect(event.data.error).to.equal('build failed line two');
    expect(event.data.features).to.equal('multisite');
    expect(event.data.app_name).to.equal('my-app');
  });

  it('does not send when the run is inside this repository', async () => {
    await trackCliCommandRun({ commandName: 'project build', cwd: __dirname });
    await trackAppBuilt({ success: true, cwd: __dirname });

    expect(dispatch.called).to.equal(false);
    expect(log.called).to.equal(false);
  });
});
