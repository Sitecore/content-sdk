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

  beforeEach(() => {
    execSyncStub = sinon.stub(childProcess, 'execSync').returns(JSON.stringify(npmQueryResultNext));
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should generate metadata and write to default path if no config is provided', async () => {
    const generate = generateMetadata();
    await generate();

    expect(execSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.getCall(0).args[0]).to.be.equal(
      path.resolve('.sitecore/metadata.json')
    );
    expect(JSON.parse(writeFileSyncStub.getCall(0).args[1])).to.have.property('capabilities');
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

  it('should omit capabilities when capability calculation is disabled', async () => {
    const generate = generateMetadata({ capabilities: false });
    await generate();

    expect(JSON.parse(writeFileSyncStub.getCall(0).args[1])).not.to.have.property('capabilities');
  });
});
