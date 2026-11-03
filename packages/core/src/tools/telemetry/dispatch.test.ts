/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import os from 'os';
import { expect } from 'chai';
import sinon from 'sinon';
import { SITECORE_EDGE_PLATFORM_HOSTNAME_ENV } from '../resolve-edge-url';
import {
  DEFAULT_TELEMETRY_URL,
  TELEMETRY_DISABLED_ENV,
  TELEMETRY_SOURCE,
  TelemetryEvent,
} from './models';
import {
  createTelemetryFingerprint,
  dispatchTelemetryEvent,
  isTelemetryEnabled,
  resetTelemetryDispatchWindow,
  resolveTelemetryUrl,
} from './dispatch';

const event = (): TelemetryEvent => ({
  source: TELEMETRY_SOURCE,
  name: 'app_scaffolded',
  data: {
    app_name: 'my-app',
    template: 'nextjs',
    create_package_version: '2.4.1',
  },
  fingerprint: {
    packageName: 'create-content-sdk-app',
    packageVersion: '2.4.1',
    os: 'darwin/arm64',
    runtimeVersion: 'node/24.0.0',
  },
});

describe('isTelemetryEnabled', () => {
  const previous = process.env[TELEMETRY_DISABLED_ENV];

  afterEach(() => {
    if (previous === undefined) {
      delete process.env[TELEMETRY_DISABLED_ENV];
    } else {
      process.env[TELEMETRY_DISABLED_ENV] = previous;
    }
  });

  it('is on by default', () => {
    delete process.env[TELEMETRY_DISABLED_ENV];
    expect(isTelemetryEnabled()).to.equal(true);
  });

  it('stays on for empty, 0, and false', () => {
    process.env[TELEMETRY_DISABLED_ENV] = '';
    expect(isTelemetryEnabled()).to.equal(true);

    process.env[TELEMETRY_DISABLED_ENV] = '0';
    expect(isTelemetryEnabled()).to.equal(true);

    process.env[TELEMETRY_DISABLED_ENV] = 'false';
    expect(isTelemetryEnabled()).to.equal(true);
  });

  it('turns off for 1, true, and yes', () => {
    process.env[TELEMETRY_DISABLED_ENV] = '1';
    expect(isTelemetryEnabled()).to.equal(false);

    process.env[TELEMETRY_DISABLED_ENV] = 'TRUE';
    expect(isTelemetryEnabled()).to.equal(false);

    process.env[TELEMETRY_DISABLED_ENV] = ' yes ';
    expect(isTelemetryEnabled()).to.equal(false);
  });

  it('turns off when the caller opts out', () => {
    delete process.env[TELEMETRY_DISABLED_ENV];
    expect(isTelemetryEnabled(false)).to.equal(false);
  });
});

describe('resolveTelemetryUrl', () => {
  const previous = process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV];

  afterEach(() => {
    if (previous === undefined) {
      delete process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV];
    } else {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = previous;
    }
  });

  it('uses the Edge Platform path by default', () => {
    delete process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV];
    expect(resolveTelemetryUrl()).to.equal(DEFAULT_TELEMETRY_URL);
    expect(DEFAULT_TELEMETRY_URL).to.equal(
      'https://edge-platform.sitecorecloud.io/telemetry/v1/events'
    );
  });

  it('uses SITECORE_EDGE_PLATFORM_HOSTNAME for the host', () => {
    process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'my-tenant.edge.example.com';
    expect(resolveTelemetryUrl()).to.equal(
      'https://my-tenant.edge.example.com/telemetry/v1/events'
    );

    process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'https://my-tenant.edge.example.com/';
    expect(resolveTelemetryUrl()).to.equal(
      'https://my-tenant.edge.example.com/telemetry/v1/events'
    );
  });

  it('lets one call replace the resolved URL', () => {
    process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = 'my-tenant.edge.example.com';
    expect(resolveTelemetryUrl('http://localhost:9/telemetry/v1/events')).to.equal(
      'http://localhost:9/telemetry/v1/events'
    );
  });
});

describe('createTelemetryFingerprint', () => {
  it('records the package and the current runtime', () => {
    const fingerprint = createTelemetryFingerprint('create-content-sdk-app', '2.4.1');

    expect(fingerprint.packageName).to.equal('create-content-sdk-app');
    expect(fingerprint.packageVersion).to.equal('2.4.1');
    expect(fingerprint.os).to.equal(`${os.platform()}/${os.arch()}`);
    expect(fingerprint.runtimeVersion).to.equal(`node/${process.versions.node}`);
  });
});

describe('dispatchTelemetryEvent', () => {
  const previousDisabled = process.env[TELEMETRY_DISABLED_ENV];
  const previousHost = process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV];

  beforeEach(() => {
    resetTelemetryDispatchWindow();
  });

  afterEach(() => {
    sinon.restore();
    if (previousDisabled === undefined) {
      delete process.env[TELEMETRY_DISABLED_ENV];
    } else {
      process.env[TELEMETRY_DISABLED_ENV] = previousDisabled;
    }
    if (previousHost === undefined) {
      delete process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV];
    } else {
      process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV] = previousHost;
    }
  });

  it('posts the event and treats 202 as success', async () => {
    delete process.env[TELEMETRY_DISABLED_ENV];
    delete process.env[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV];
    const fetchImpl = sinon.stub().resolves(new Response(null, { status: 202 }));

    const sent = await dispatchTelemetryEvent(event(), { fetchImpl });

    expect(sent).to.equal(true);
    expect(fetchImpl.calledOnce).to.equal(true);
    const [url, init] = fetchImpl.firstCall.args;
    expect(url).to.equal(DEFAULT_TELEMETRY_URL);
    expect(init.method).to.equal('POST');
    const body = JSON.parse(init.body);
    expect(body.source).to.equal('contentsdk');
    expect(body.name).to.equal('app_scaffolded');
    expect(body.data.app_name).to.equal('my-app');
    expect(body.fingerprint.packageName).to.equal('create-content-sdk-app');
    expect(body.date).to.be.a('number');
    expect(body).to.not.have.property('destinations');
  });

  it('does not call fetch when telemetry is disabled', async () => {
    process.env[TELEMETRY_DISABLED_ENV] = '1';
    const fetchImpl = sinon.stub();

    const sent = await dispatchTelemetryEvent(event(), { fetchImpl });

    expect(sent).to.equal(false);
    expect(fetchImpl.called).to.equal(false);
  });

  it('returns false for a nested data value', async () => {
    const fetchImpl = sinon.stub();
    const invalid = event();
    (invalid.data as Record<string, unknown>).packages = { nextjs: '1.0.0' };

    const sent = await dispatchTelemetryEvent(invalid, { fetchImpl });

    expect(sent).to.equal(false);
    expect(fetchImpl.called).to.equal(false);
  });

  it('returns false for a kebab-case event name', async () => {
    const fetchImpl = sinon.stub();
    const invalid = event();
    invalid.name = 'csdk-app-scaffolded';

    const sent = await dispatchTelemetryEvent(invalid, { fetchImpl });

    expect(sent).to.equal(false);
    expect(fetchImpl.called).to.equal(false);
  });

  it('returns false when the request fails', async () => {
    const fetchImpl = sinon.stub().rejects(new Error('offline'));

    const sent = await dispatchTelemetryEvent(event(), { fetchImpl });

    expect(sent).to.equal(false);
  });

  it('returns false for an os value that is not platform/arch', async () => {
    const fetchImpl = sinon.stub();
    const invalid = event();
    invalid.fingerprint.os = 'not an os';

    const sent = await dispatchTelemetryEvent(invalid, { fetchImpl });

    expect(sent).to.equal(false);
    expect(fetchImpl.called).to.equal(false);
  });

  it('returns false when the date is far from now', async () => {
    const fetchImpl = sinon.stub();
    const invalid = event();
    invalid.date = Date.now() - 8 * 24 * 60 * 60 * 1000;

    const sent = await dispatchTelemetryEvent(invalid, { fetchImpl });

    expect(sent).to.equal(false);
    expect(fetchImpl.called).to.equal(false);
  });

  it('refuses fetches after ten events in a minute', async () => {
    const fetchImpl = sinon.stub().resolves(new Response(null, { status: 202 }));

    for (let attempt = 0; attempt < 10; attempt += 1) {
      expect(await dispatchTelemetryEvent(event(), { fetchImpl })).to.equal(true);
    }

    expect(await dispatchTelemetryEvent(event(), { fetchImpl })).to.equal(false);
    expect(fetchImpl.callCount).to.equal(10);
  });

  it('returns false when the receiver does not respond in time', async () => {
    const fetchImpl = sinon.stub().callsFake((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(init.signal?.reason ?? new Error('aborted'));
        });
      });
    });

    const sent = await dispatchTelemetryEvent(event(), { fetchImpl, timeoutMs: 20 });

    expect(sent).to.equal(false);
    expect(fetchImpl.calledOnce).to.equal(true);
  });
});
