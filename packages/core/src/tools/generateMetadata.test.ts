import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import * as td from 'testdouble';
import npmQueryResultNext from '../test-data/metadata/npm-query-nextjs.json' with { type: 'json' };

describe('generateMetadata', () => {
  let execSyncStub: sinon.SinonStub;
  let writeFileSyncStub: sinon.SinonStub;
  let generateMetadataModule: any;
  beforeEach(async () => {
    execSyncStub = sinon.stub().returns(JSON.stringify(npmQueryResultNext));
    await td.replaceEsm(
      'child_process',
      {
        execSync: execSyncStub,
      },
      {
        execSync: execSyncStub,
      }
    );
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');

    generateMetadataModule = await import('./generateMetadata.js');
  });

  afterEach(() => {
    sinon.restore();
    td.reset();
  });

  it('should generate metadata and write to default path if no config is provided', async () => {
    const generate = generateMetadataModule.generateMetadata();
    await generate();

    expect(execSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.getCall(0).args[0]).to.be.equal(
      path.resolve('.sitecore/metadata.json')
    );
  });

  it('should generate metadata and write to specified path if config is provided', async () => {
    const config = { destinationPath: 'custom/path/metadata.json' };
    const generate = generateMetadataModule.generateMetadata(config);
    await generate();

    expect(execSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.getCall(0).args[0]).to.be.equal(path.resolve(config.destinationPath));
  });
});
