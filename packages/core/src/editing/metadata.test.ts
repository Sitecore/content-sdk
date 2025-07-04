/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import * as td from 'testdouble';
import sinon, { SinonStub } from 'sinon';
import childProcess from 'child_process';
import metadataNextjs from '../test-data/metadata/metadata-nextjs.json' with { type: 'json' };
import npmQueryResultNext from '../test-data/metadata/npm-query-nextjs.json' with { type: 'json' };
import npmQueryResultNoSc from '../test-data/metadata/npm-query-no-sc.json' with { type: 'json' };

describe('metadata', () => {
  let execSyncStub: SinonStub;
  let logStub: SinonStub;
  let metadataModule: any;

  beforeEach(async () => {
    execSyncStub = sinon.stub();
    await td.replaceEsm(
      'child_process',
      {
        execSync: execSyncStub,
      },
      {
        execSync: execSyncStub,
      }
    );

    logStub = sinon.stub();
    await td.replaceEsm('debug', undefined, {
      metadata: logStub,
    });

    metadataModule = await import('./metadata.js');
  });

  afterEach(() => {
    sinon.restore();
    td.reset();
  });

  describe('getMetadata', () => {
    it('should return tracked packages with exact versions from result of npm query (nextjs app)', () => {
      execSyncStub
        .withArgs('npm query [name*=@sitecore] --workspaces false')
        .returns(JSON.stringify(npmQueryResultNext));
      const metadata = metadataModule.getMetadata();
      expect(metadata).to.deep.equal(metadataNextjs);
    });

    it('should return metadata with empty package object and log error in the console if result of npm query is not valid', () => {
      execSyncStub = sinon.stub(childProcess, 'execSync');
      execSyncStub.withArgs('npm query [name*=@sitecore] --workspaces false').returns('[{"name":}');
      logStub = sinon.stub(console, 'error');

      const metadata = metadataModule.getMetadata();
      expect(logStub.calledOnceWith('Failed to retrieve sitecore packages using npm query')).to.be
        .true;
      expect(metadata).to.deep.equal({ packages: {} });
    });

    it('should return metadata with empty package object and log error in the console if npm query command fails', () => {
      execSyncStub = sinon.stub(childProcess, 'execSync');
      execSyncStub.withArgs('npm query [name*=@sitecore] --workspaces false').throws();
      logStub = sinon.stub(console, 'error');

      const metadata = metadataModule.getMetadata();
      expect(logStub.calledOnceWith('Failed to retrieve sitecore packages using npm query')).to.be
        .true;
      expect(metadata).to.deep.equal({ packages: {} });
    });

    it('should not return packages for result of npm query not containng tracked packages', () => {
      execSyncStub = sinon.stub(childProcess, 'execSync');
      execSyncStub
        .withArgs('npm query [name*=@sitecore] --workspaces false')
        .returns(JSON.stringify(npmQueryResultNoSc));
      const metadata = metadataModule.getMetadata();
      expect(metadata).to.deep.equal({ packages: {} });
    });
  });
});
