/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import fs from 'fs';
import os from 'os';
import path from 'path';
import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import chalk from 'chalk';
import { telemetryClient } from '@sitecore-content-sdk/core/node-tools';
import * as monorepo from './monorepo';
import {
  TELEMETRY_NOTICE,
  buildAppScaffoldedEvent,
  trackAppScaffolded,
} from './track-app-scaffolded';

chai.use(sinonChai);

describe('trackAppScaffolded', () => {
  let root: string;
  let skipStub: SinonStub;
  let enabledStub: SinonStub;
  let dispatchStub: SinonStub;
  let logStub: SinonStub;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'csdk-scaffold-event-'));
    skipStub = sinon.stub(monorepo, 'shouldSkipScaffoldTelemetry').returns(false);
    enabledStub = sinon.stub(telemetryClient, 'isTelemetryEnabled').returns(true);
    dispatchStub = sinon.stub(telemetryClient, 'dispatchTelemetryEvent').resolves(true);
    logStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    skipStub.restore();
    enabledStub.restore();
    dispatchStub.restore();
    logStub.restore();
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('sends a flat scaffold event and tells the user telemetry is on', async () => {
    writeAppPackage();

    await trackAppScaffolded({
      template: 'nextjs',
      destination: root,
      silent: false,
    });

    expect(logStub).to.have.been.calledWith(chalk.dim(TELEMETRY_NOTICE));
    expect(dispatchStub).to.have.been.calledOnce;
    const event = dispatchStub.firstCall.args[0];
    expect(event.source).to.equal('contentsdk');
    expect(event.name).to.equal('app_scaffolded');
    expect(event.data.app_name).to.equal('my-app');
    expect(event.data.template).to.equal('nextjs');
    expect(event.data.create_package_version).to.be.a('string');
    expect(event.data.nextjs_version).to.equal('^2.4.1');
    expect(event.data.core_version).to.equal('^2.1.4');
    expect(event.data).to.not.have.property('react');
    expect(event.fingerprint.packageName).to.equal('create-content-sdk-app');
    expect(event.fingerprint.packageVersion).to.equal(event.data.create_package_version);
  });

  it('does not send or print a notice when the run is skipped', async () => {
    skipStub.returns(true);

    await trackAppScaffolded({
      template: 'nextjs',
      destination: root,
      silent: false,
      noTelemetry: true,
    });

    expect(dispatchStub).to.not.have.been.called;
    expect(logStub).to.not.have.been.called;
  });

  it('does not send or print a notice when telemetry is disabled', async () => {
    enabledStub.returns(false);
    writeAppPackage();

    await trackAppScaffolded({
      template: 'nextjs',
      destination: root,
      silent: false,
    });

    expect(dispatchStub).to.not.have.been.called;
    expect(logStub).to.not.have.been.called;
  });

  it('suppresses the notice when silent', async () => {
    writeAppPackage();

    await trackAppScaffolded({
      template: 'nextjs',
      destination: root,
      silent: true,
    });

    expect(logStub).to.not.have.been.called;
    expect(dispatchStub).to.have.been.calledOnce;
  });

  it('uses the destination folder name when package.json has no name', () => {
    const event = buildAppScaffoldedEvent({
      template: 'nextjs-app-router',
      destination: root,
    });

    expect(event?.data.app_name).to.equal(path.basename(root));
    expect(event?.data.template).to.equal('nextjs-app-router');
    expect(event?.data).to.not.have.property('nextjs_version');
  });

  it('does not build an event when the template name is not a simple slug', () => {
    expect(
      buildAppScaffoldedEvent({
        template: 'not a template',
        destination: root,
      })
    ).to.equal(undefined);
  });

  /**
   * Writes a generated app package.json into the temp directory.
   */
  function writeAppPackage() {
    fs.writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify({
        name: 'my-app',
        dependencies: {
          '@sitecore-content-sdk/nextjs': '^2.4.1',
          react: '^19.0.0',
        },
        devDependencies: {
          '@sitecore-content-sdk/core': '^2.1.4',
        },
      })
    );
  }
});
