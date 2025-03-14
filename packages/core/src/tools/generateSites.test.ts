import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { GenerateSitesConfig } from './generateSites';
import { SiteInfo, GraphQLSiteInfoService } from '../site';
import { SitecoreConfigInput, defineConfig } from '../config';
import proxyquire from 'proxyquire';

const defaultSite: SiteInfo = {
  name: 'defaultSite',
  hostName: 'defaultSite.com',
  language: 'en',
};

const mockConfig: SitecoreConfigInput = {
  api: {
    edge: {
      contextId: 'context-id',
      clientContextId: 'client-id',
    },
  },
  defaultSite: defaultSite.name,
  defaultLanguage: defaultSite.language,
  multisite: {
    enabled: true,
    defaultHostname: defaultSite.hostName,
  },
};

describe('generateSites', () => {
  let ensurePathExistsStub: sinon.SinonStub;
  let fsWriteFileSyncStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let generateSites: any;

  beforeEach(() => {
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
    const scConfig = defineConfig(mockConfig);
    const config: GenerateSitesConfig = {
      scConfig,
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
    const destinationPath = 'custom/path/sites.json';
    const scConfig = defineConfig(mockConfig);
    const config: GenerateSitesConfig = {
      scConfig,
      destinationPath: destinationPath,
    };

    const generate = generateSites(config);
    await generate();

    const expectedPath = path.resolve(destinationPath);
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

    sinon.stub(GraphQLSiteInfoService.prototype, 'fetchSiteInfo').resolves(fetchedSites);

    const scConfig = defineConfig(mockConfig);
    const config: GenerateSitesConfig = {
      scConfig,
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
    sinon.stub(GraphQLSiteInfoService.prototype, 'fetchSiteInfo').rejects(new Error('Fetch error'));
    const scConfig = defineConfig(mockConfig);

    const config: GenerateSitesConfig = {
      scConfig,
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
