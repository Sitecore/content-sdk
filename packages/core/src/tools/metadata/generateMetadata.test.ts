/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { generateMetadata } from './generateMetadata';
import childProcess from 'child_process';
import npmQueryResultNext from './test-data/npm-query-nextjs.json';

describe('generateMetadata', () => {
  let execSyncStub: sinon.SinonStub;
  let writeFileSyncStub: sinon.SinonStub;
  const originalExecPath = process.env.npm_execpath;
  const originalUserAgent = process.env.npm_config_user_agent;

  beforeEach(() => {
    delete process.env.npm_execpath;
    process.env.npm_config_user_agent = 'npm/10.0.0 node/v22.0.0';
    execSyncStub = sinon.stub(childProcess, 'execSync').returns(JSON.stringify(npmQueryResultNext));
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
  });

  afterEach(() => {
    sinon.restore();

    if (originalExecPath === undefined) {
      delete process.env.npm_execpath;
    } else {
      process.env.npm_execpath = originalExecPath;
    }

    if (originalUserAgent === undefined) {
      delete process.env.npm_config_user_agent;
    } else {
      process.env.npm_config_user_agent = originalUserAgent;
    }
  });

  it('should generate metadata and write to default path if no config is provided', async () => {
    const generate = generateMetadata();
    await generate();

    expect(execSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.getCall(0).args[0]).to.be.equal(
      path.resolve('.sitecore/metadata.json')
    );
  });

  it('should generate metadata and write to specified path if config is provided', async () => {
    const config = { destinationPath: 'custom/path/metadata.json' };
    const generate = generateMetadata(config);
    await generate();

    expect(execSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.getCall(0).args[0]).to.be.equal(path.resolve(config.destinationPath));
  });

  it('should generate metadata with allowWorkspaces set to true', async () => {
    const config = { allowWorkspaces: true };
    const generate = generateMetadata(config);
    await generate();

    expect(execSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.getCall(0).args[0]).to.be.equal(
      path.resolve('.sitecore/metadata.json')
    );
  });
});
