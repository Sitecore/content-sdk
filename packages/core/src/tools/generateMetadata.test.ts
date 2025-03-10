import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { generateMetadata } from './generateMetadata';
import childProcess from 'child_process';
import npmQueryResultNext from '../test-data/metadata/npm-query-nextjs.json';

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
  });

  it('should generate metadata and write to specified path if config is provided', async () => {
    const config = { destinationPath: 'custom/path/metadata.json' };
    const generate = generateMetadata(config);
    await generate();

    expect(execSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.getCall(0).args[0]).to.be.equal(path.resolve(config.destinationPath));
  });
});
