/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import { isRunningInsideContentSdkRepo, shouldSkipScaffoldTelemetry } from './monorepo';

describe('scaffold telemetry monorepo guard', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'csdk-telemetry-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('recognizes this repository', () => {
    expect(isRunningInsideContentSdkRepo(__dirname)).to.equal(true);
  });

  it('does not treat an unrelated directory as the repository', () => {
    expect(isRunningInsideContentSdkRepo(root)).to.equal(false);
  });

  it('skips an explicit opt-out', () => {
    expect(shouldSkipScaffoldTelemetry({ noTelemetry: true }, root)).to.equal(true);
  });

  it('skips when the working directory or destination is inside the repository', () => {
    fs.mkdirSync(path.join(root, 'packages', 'create-content-sdk-app'), { recursive: true });
    fs.writeFileSync(path.join(root, 'lerna.json'), '{}');
    fs.writeFileSync(path.join(root, 'packages', 'create-content-sdk-app', 'package.json'), '{}');
    const appDir = path.join(root, 'samples', 'nextjs');
    fs.mkdirSync(appDir, { recursive: true });

    expect(shouldSkipScaffoldTelemetry({ destination: path.join(root, 'outside') }, root)).to.equal(
      true
    );
    expect(
      shouldSkipScaffoldTelemetry({ destination: appDir }, path.join(root, 'outside'))
    ).to.equal(true);
  });

  it('tracks a scaffold created outside the repository', () => {
    const outside = path.join(root, 'customer');
    fs.mkdirSync(outside, { recursive: true });

    expect(
      shouldSkipScaffoldTelemetry({ destination: path.join(outside, 'my-app'), noTelemetry: false }, outside)
    ).to.equal(false);
  });
});
