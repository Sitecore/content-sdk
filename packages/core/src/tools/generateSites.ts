import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

import { SiteInfo, GraphQLSiteInfoService } from '../site';
import { ensurePathExists } from '../utils/ensurePath';
import { SitecoreConfig } from '../config';
import { createGraphQLClientFactory } from '../client';

const DEFAULT_SITES_DIST_PATH = '.sitecore/sites.json';

/**
 * Configuration object for generating sites.
 */
export type GenerateSitesConfig = {
  /**
   * The Sitecore configuration used at build and run time.
   */
  scConfig: SitecoreConfig;

  /**
   * Optional path where the generated sites will be saved.
   * If not provided, the default '.sitecore/sites.json' will be used.
   */
  destinationPath?: string;
};

/**
 * Generates site information and writes it to a specified destination path.
 * @param {GenerateSitesConfig} config - The configuration for generating site info.
 * @param {GraphQLSiteInfoService} config.scConfig - The Sitecore configuration used at build and run time.
 * @param {string} config.destinationPath - The optional path where the generated sites file will be written. Defaults to '.sitecore/sites.json'.
 * @returns {Promise<Function>} - A promise that resolves to an asynchronous function that fetches site information and writes it to a file.
 */
export const generateSites = ({
  scConfig,
  destinationPath,
}: GenerateSitesConfig): (() => Promise<void>) => {
  return async () => {
    let sites: SiteInfo[] = [];
    const sitesFilePath = path.resolve(destinationPath ?? DEFAULT_SITES_DIST_PATH);

    if (scConfig.multisite.enabled) {
      try {
        const siteInfoService = new GraphQLSiteInfoService({
          clientFactory: createGraphQLClientFactory({
            api: scConfig.api,
            retries: scConfig.retries.count,
            retryStrategy: scConfig.retries.retryStrategy,
          }),
        });

        console.log('Fetching site information');
        sites = await siteInfoService.fetchSiteInfo();
      } catch (error) {
        console.error(chalk.red('Error fetching site information'));
        console.error(error);
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

    console.log(`Writing site info to ${sitesFilePath}`);
    fs.writeFileSync(sitesFilePath, JSON.stringify(sites, null, 2), { encoding: 'utf8' });
  };
};
