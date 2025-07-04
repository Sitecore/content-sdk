import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import chalk from 'chalk';
import { type SiteInfo } from '../site/index.js';
import { SitecoreConfigInput, defineConfig } from '../config/index.js';
import * as td from 'testdouble';

const defaultSite: SiteInfo = {
  name: 'defaultSite',
  hostName: '*',
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
  },
};

describe('generateSites', () => {
  let ensurePathExistsStub: sinon.SinonStub;
  let fsWriteFileSyncStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let mockGraphQLSiteInfoService: any;
  let mockFetchSiteInfo: sinon.SinonStub;
  let generateSites: any;

  beforeEach(async () => {
    fsWriteFileSyncStub = sinon.stub();
    await td.replaceEsm('fs', undefined, {
      writeFileSync: fsWriteFileSyncStub,
    });
    consoleLogStub = sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');
    ensurePathExistsStub = sinon.stub();
    await td.replaceEsm('../utils/ensurePath.ts', {
      ensurePathExists: ensurePathExistsStub,
    });

    // Create a mock GraphQLSiteInfoService class
    mockFetchSiteInfo = sinon.stub().resolves([]);
    class MockGraphQLSiteInfoService {
      fetchSiteInfo = mockFetchSiteInfo;
    }
    mockGraphQLSiteInfoService = MockGraphQLSiteInfoService;

    // Replace the GraphQLSiteInfoService in the site module
    await td.replaceEsm('../site/graphql-siteinfo-service.ts', {
      GraphQLSiteInfoService: mockGraphQLSiteInfoService,
    });

    const generateSitesModule = await import('./generateSites.js');
    generateSites = generateSitesModule.generateSites;
  });

  afterEach(() => {
    sinon.restore();
    td.reset();
  });

  it('should write site info to the default path when destinationPath is not provided', async () => {
    const scConfig = defineConfig(mockConfig);
    const config: any = {
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
    const config: any = {
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

    // Setup the mock to return the fetched sites
    mockFetchSiteInfo.resolves(fetchedSites);

    const scConfig = defineConfig(mockConfig);
    const config: any = {
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
    // Setup the mock to reject with an error
    mockFetchSiteInfo.rejects(new Error('Fetch error'));

    const scConfig = defineConfig(mockConfig);

    const config: any = {
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
