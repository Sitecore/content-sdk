import fs from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import { isContentSdkCheckout, shouldSkipCliTelemetry } from './skip';

describe('cli telemetry skip', () => {
  let root: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'csdk-cli-telemetry-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('recognizes this repository', () => {
    expect(isContentSdkCheckout(__dirname)).to.equal(true);
  });

  it('does not treat a customer checkout as this repository', () => {
    fs.writeFileSync(path.join(root, 'lerna.json'), '{}');
    fs.mkdirSync(path.join(root, 'packages', 'cli'), { recursive: true });

    expect(isContentSdkCheckout(root)).to.equal(false);
    expect(shouldSkipCliTelemetry(false, root)).to.equal(false);
  });

  it('skips an explicit opt-out and this repository', () => {
    expect(shouldSkipCliTelemetry(true, root)).to.equal(true);
    expect(shouldSkipCliTelemetry(false, __dirname)).to.equal(true);
  });
});
