/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import { shouldSkipScaffoldTelemetry } from './monorepo';

describe('scaffold telemetry monorepo guard', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'csdk-telemetry-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('skips when the command runs inside this repository', () => {
    expect(shouldSkipScaffoldTelemetry({ destination: path.join(root, 'app') }, __dirname)).to.equal(
      true
    );
  });

  it('skips an explicit opt-out', () => {
    expect(shouldSkipScaffoldTelemetry({ noTelemetry: true }, root)).to.equal(true);
  });

  it('skips when the working directory or destination is inside a lerna checkout', () => {
    fs.writeFileSync(path.join(root, 'lerna.json'), '{}');
    const appDir = path.join(root, 'my-app');
    fs.mkdirSync(appDir, { recursive: true });
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'csdk-telemetry-outside-'));

    try {
      expect(shouldSkipScaffoldTelemetry({ destination: path.join(outside, 'app') }, root)).to.equal(
        true
      );
      expect(shouldSkipScaffoldTelemetry({ destination: appDir }, outside)).to.equal(true);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });

  it('tracks a scaffold created outside the repository', () => {
    const outside = path.join(root, 'customer');
    fs.mkdirSync(outside, { recursive: true });

    expect(
      shouldSkipScaffoldTelemetry(
        { destination: path.join(outside, 'my-app'), noTelemetry: false },
        outside
      )
    ).to.equal(false);
  });
});
