import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { GenerateSitesConfig } from './generateSites';
import { SiteInfo, GraphQLSiteInfoService } from '../site';
import proxyquire from 'proxyquire';

const defaultSite: SiteInfo = {
  name: 'defaultSite',
  hostName: 'defaultSite.com',
  language: 'en',
};

describe('generateSites', () => {
  let siteInfoServiceStub: sinon.SinonStubbedInstance<GraphQLSiteInfoService>;
  let ensurePathExistsStub: sinon.SinonStub;
  let fsWriteFileSyncStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let generateSites: any;

  beforeEach(() => {
    siteInfoServiceStub = sinon.createStubInstance(GraphQLSiteInfoService);
    ensurePathExistsStub = sinon.stub();
    fsWriteFileSyncStub = sinon.stub(fs, 'writeFileSync');
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');

    const generateSitesModule = proxyquire('./generateSites', {
      '../utils/ensurePath': { ensurePathExists: ensurePathExistsStub },
    });
    generateSites = generateSitesModule.generateSites;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should write site info to the default path when destinationPath is not provided', async () => {
    const config: GenerateSitesConfig = {
      multisiteEnabled: false,
      defaultSite,
      siteInfoService: siteInfoServiceStub,
    };

    const generate = generateSites(config);
    await generate();

    const expectedPath = path.resolve('.sitecore/sites.json');
    expect(ensurePathExistsStub.calledWith(expectedPath)).to.be.true;
    expect(
      fsWriteFileSyncStub.calledWith(expectedPath, JSON.stringify([defaultSite], null, 2), {
        encoding: 'utf8',
      })
    ).to.be.true;
    expect(consoleLogStub.calledWith(`Writing site info to ${expectedPath}`)).to.be.true;
  });

  it('should write site info to the provided destinationPath', async () => {
    const config: GenerateSitesConfig = {
      multisiteEnabled: false,
      defaultSite,
      siteInfoService: siteInfoServiceStub,
      destinationPath: 'custom/path/sites.json',
    };

    const generate = generateSites(config);
    await generate();

    const expectedPath = path.resolve('custom/path/sites.json');
    expect(ensurePathExistsStub.calledWith(expectedPath)).to.be.true;
    expect(
      fsWriteFileSyncStub.calledWith(expectedPath, JSON.stringify([defaultSite], null, 2), {
        encoding: 'utf8',
      })
    ).to.be.true;
    expect(consoleLogStub.calledWith(`Writing site info to ${expectedPath}`)).to.be.true;
  });

  it('should fetch site information when multisiteEnabled is true', async () => {
    const fetchedSites: SiteInfo[] = [
      { name: 'site1', hostName: 'site1.com', language: 'de/DE' },
      { name: 'site2', hostName: 'site2.com', language: 'da/DK' },
    ];
    siteInfoServiceStub.fetchSiteInfo.resolves(fetchedSites);

    const config: GenerateSitesConfig = {
      multisiteEnabled: true,
      defaultSite,
      siteInfoService: siteInfoServiceStub,
    };

    const generate = generateSites(config);
    await generate();

    const expectedPath = path.resolve('.sitecore/sites.json');
    expect(ensurePathExistsStub.calledWith(expectedPath)).to.be.true;

    expect(
      fsWriteFileSyncStub.calledWith(expectedPath, JSON.stringify(fetchedSites, null, 2), {
        encoding: 'utf8',
      })
    ).to.be.true;
    expect(consoleLogStub.calledWith('Fetching site information')).to.be.true;
    expect(consoleLogStub.calledWith(`Writing site info to ${expectedPath}`)).to.be.true;
  });

  it('should log an error when fetching site information fails', async () => {
    siteInfoServiceStub.fetchSiteInfo.rejects(new Error('Fetch error'));

    const config: GenerateSitesConfig = {
      multisiteEnabled: true,
      defaultSite,
      siteInfoService: siteInfoServiceStub,
    };

    const generate = generateSites(config);
    await generate();

    const expectedPath = path.resolve('.sitecore/sites.json');
    expect(ensurePathExistsStub.calledWith(expectedPath)).to.be.true;
    expect(
      fsWriteFileSyncStub.calledWith(expectedPath, JSON.stringify([defaultSite], null, 2), {
        encoding: 'utf8',
      })
    ).to.be.true;
    expect(consoleLogStub.calledWith('Fetching site information')).to.be.true;
    expect(consoleErrorStub.calledWith(chalk.red('Error fetching site information'))).to.be.true;
    expect(consoleErrorStub.calledWith(sinon.match.instanceOf(Error))).to.be.true;
  });
});
