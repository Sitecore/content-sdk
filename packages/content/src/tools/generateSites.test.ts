/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { constants } from '@sitecore-content-sdk/core';
import { GenerateSitesConfig } from './generateSites';
import { SiteInfo, SiteInfoService } from '../site';
import { SitecoreConfigInput, defineConfig } from '../config';
import proxyquire from 'proxyquire';
import nock from 'nock';

const { ERROR_MESSAGES } = constants;

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
  let consoleErrorStub: sinon.SinonStub;
  let generateSites: any;

  beforeEach(() => {
    ensurePathExistsStub = sinon.stub();
    fsWriteFileSyncStub = sinon.stub(fs, 'writeFileSync');
    sinon.stub(console, 'log');
    consoleErrorStub = sinon.stub(console, 'error');

    const generateSitesModule = proxyquire('./generateSites', {
      '@sitecore-content-sdk/core/node-tools': { ensurePathExists: ensurePathExistsStub },
    });
    generateSites = generateSitesModule.generateSites;
  });

  afterEach(() => {
    sinon.restore();
    nock.cleanAll();
  });

  const runCommand = (generateSitesConfig: GenerateSitesConfig) => {
    const scConfig = defineConfig(mockConfig);
    const generate = generateSites(generateSitesConfig);
    return generate({ scConfig });
  };

  it('should write site info to the default path when destinationPath is not provided', async () => {
    const config: GenerateSitesConfig = {};
    sinon.stub(SiteInfoService.prototype, 'fetchSiteInfo').resolves([defaultSite]);

    await runCommand(config);

    const expectedPath = path.resolve('.sitecore/sites.json');
    expect(ensurePathExistsStub.calledWith(expectedPath)).to.be.true;
    expect(
      fsWriteFileSyncStub.calledWith(
        expectedPath,
        JSON.stringify([defaultSite, defaultSite], null, 2),
        {
          encoding: 'utf8',
        }
      )
    ).to.be.true;
  });

  it('should write site info to the provided destinationPath', async () => {
    const destinationPath = 'custom/path/sites.json';
    const config: GenerateSitesConfig = {
      destinationPath: destinationPath,
    };
    sinon.stub(SiteInfoService.prototype, 'fetchSiteInfo').resolves([defaultSite]);

    await runCommand(config);

    const expectedPath = path.resolve(destinationPath);
    expect(ensurePathExistsStub.calledWith(expectedPath)).to.be.true;
    expect(
      fsWriteFileSyncStub.calledWith(
        expectedPath,
        JSON.stringify([defaultSite, defaultSite], null, 2),
        {
          encoding: 'utf8',
        }
      )
    ).to.be.true;
  });

  it('should fetch site information when multisiteEnabled is true', async () => {
    const fetchedSites: SiteInfo[] = [
      { name: 'site1', hostName: 'site1.com', language: 'de/DE' },
      { name: 'site2', hostName: 'site2.com', language: 'da/DK' },
    ];
    sinon.stub(SiteInfoService.prototype, 'fetchSiteInfo').resolves([...fetchedSites]);

    const config: GenerateSitesConfig = {};

    await runCommand(config);

    const expectedPath = path.resolve('.sitecore/sites.json');
    expect(ensurePathExistsStub.calledWith(expectedPath)).to.be.true;

    expect(
      fsWriteFileSyncStub.calledWith(
        expectedPath,
        JSON.stringify([defaultSite, ...fetchedSites], null, 2),
        {
          encoding: 'utf8',
        }
      )
    ).to.be.true;
  });

  it('should not prepend default site when defaultSite is not configured', async () => {
    const fetchedSites: SiteInfo[] = [
      { name: 'site1', hostName: 'site1.com', language: 'de/DE' },
    ];
    sinon.stub(SiteInfoService.prototype, 'fetchSiteInfo').resolves([...fetchedSites]);

    const scConfig = defineConfig({
      ...mockConfig,
      defaultSite: undefined,
    });
    const generate = generateSites({});
    await generate({ scConfig });

    const expectedPath = path.resolve('.sitecore/sites.json');
    expect(
      fsWriteFileSyncStub.calledWith(expectedPath, JSON.stringify(fetchedSites, null, 2), {
        encoding: 'utf8',
      })
    ).to.be.true;
  });

  it('should write an empty sites file when defaultSite is not configured and no sites are fetched', async () => {
    sinon.stub(SiteInfoService.prototype, 'fetchSiteInfo').resolves([]);

    const scConfig = defineConfig({
      ...mockConfig,
      defaultSite: undefined,
    });
    const generate = generateSites({});
    await generate({ scConfig });

    const expectedPath = path.resolve('.sitecore/sites.json');
    expect(
      fsWriteFileSyncStub.calledWith(expectedPath, JSON.stringify([], null, 2), { encoding: 'utf8' })
    ).to.be.true;
  });

  it('should log an error when fetching site information fails', async () => {
    sinon.stub(SiteInfoService.prototype, 'fetchSiteInfo').rejects(new Error('Fetch error'));
    const config: GenerateSitesConfig = {};

    try {
      await runCommand(config);
      expect.fail('Expected function to throw an error');
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect((error as Error).message).to.include('Fetch error');
    }

    expect(
      consoleErrorStub.calledWith(
        chalk.red(`Failed to fetch site information. ${ERROR_MESSAGES.CONTACT_SUPPORT}`)
      )
    ).to.be.true;
  });
});
