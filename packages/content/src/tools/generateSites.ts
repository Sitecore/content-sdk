import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import { ensurePathExists } from '@sitecore-content-sdk/core/tools';
import { SiteInfo, SiteInfoService } from '../site';
import { SitecoreConfig } from '../config';
import { createGraphQLClientFactory } from '../client';
import debug from '../debug';

const DEFAULT_SITES_DIST_PATH = '.sitecore/sites.json';

/**
 * Configuration object for generating sites.
 * @public
 */
export type GenerateSitesConfig = {
  /**
   * Optional path where the generated sites will be saved.
   * If not provided, the default '.sitecore/sites.json' will be used.
   */
  destinationPath?: string;
};

/**
 * Generates site information and writes it to a specified destination path.
 * @param {GenerateSitesConfig} config - The configuration for generating site info.
 * @returns {Promise<Function>} - A promise that resolves to an asynchronous function that fetches site information and writes it to a file.
 * @public
 */
export const generateSites = ({
  destinationPath,
}: GenerateSitesConfig = {}): (() => Promise<void>) => {
  return async ({ scConfig }: { scConfig?: SitecoreConfig } = {}) => {
    if (!scConfig) {
      throw new Error('Sitecore configuration is required to be provided');
    }

    let sites: SiteInfo[] = [];
    const sitesFilePath = path.resolve(destinationPath ?? DEFAULT_SITES_DIST_PATH);

    debug.multisite(
      scConfig.multisite.enabled
        ? 'Multisite Enabled: Generating site information'
        : 'Multisite Disabled'
    );

    if (scConfig.multisite.enabled) {
      try {
        const siteInfoService = new SiteInfoService({
          clientFactory: createGraphQLClientFactory({
            api: scConfig.api,
            retries: scConfig.retries.count,
            retryStrategy: scConfig.retries.retryStrategy,
          }),
        });

        sites = await siteInfoService.fetchSiteInfo();
      } catch (error) {
        console.error(chalk.red('Error fetching site information'));
        throw error;
      }
    }

    // Add default site to the list
    const defaultSite: SiteInfo = {
      name: scConfig.defaultSite,
      hostName: '*',
      language: scConfig.defaultLanguage,
    };
    sites.unshift(defaultSite);

    ensurePathExists(sitesFilePath);

    fs.writeFileSync(sitesFilePath, JSON.stringify(sites, null, 2), { encoding: 'utf8' });
  };
};
