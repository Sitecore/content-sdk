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

  it('recognizes this repository through its linked packages', () => {
    expect(isContentSdkCheckout(__dirname)).to.equal(true);
  });

  it('does not treat a customer checkout as this repository', () => {
    fs.writeFileSync(path.join(root, 'lerna.json'), '{}');
    fs.mkdirSync(path.join(root, 'packages', 'create-content-sdk-app'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'packages', 'create-content-sdk-app', 'package.json'),
      '{}'
    );
    const installed = path.join(root, 'node_modules', '@sitecore-content-sdk', 'cli');
    fs.mkdirSync(installed, { recursive: true });
    fs.writeFileSync(path.join(installed, 'package.json'), '{}');

    expect(isContentSdkCheckout(root)).to.equal(false);
    expect(shouldSkipCliTelemetry(false, root)).to.equal(false);
  });

  it('does not treat a package-manager store link as this repository', () => {
    const store = path.join(root, 'store', 'cli');
    const link = path.join(root, 'app', 'node_modules', '@sitecore-content-sdk', 'cli');
    fs.mkdirSync(store, { recursive: true });
    fs.mkdirSync(path.dirname(link), { recursive: true });
    fs.writeFileSync(path.join(store, 'package.json'), '{}');
    fs.symlinkSync(store, link, 'dir');

    expect(isContentSdkCheckout(path.join(root, 'app'))).to.equal(false);
  });

  it('skips when an installed package links into this source checkout', () => {
    const checkout = path.join(root, 'content-sdk');
    const source = path.join(checkout, 'packages', 'cli');
    const link = path.join(root, 'app', 'node_modules', '@sitecore-content-sdk', 'cli');
    fs.mkdirSync(path.join(checkout, 'packages', 'create-content-sdk-app'), { recursive: true });
    fs.mkdirSync(source, { recursive: true });
    fs.mkdirSync(path.dirname(link), { recursive: true });
    fs.writeFileSync(path.join(checkout, 'lerna.json'), '{}');
    fs.writeFileSync(
      path.join(checkout, 'packages', 'create-content-sdk-app', 'package.json'),
      '{}'
    );
    fs.symlinkSync(source, link, 'dir');

    expect(isContentSdkCheckout(path.join(root, 'app'))).to.equal(true);
  });

  it('skips an explicit opt-out and this repository', () => {
    expect(shouldSkipCliTelemetry(true, root)).to.equal(true);
    expect(shouldSkipCliTelemetry(false, __dirname)).to.equal(true);
  });
});
