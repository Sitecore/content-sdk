import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

import { SiteInfo, GraphQLSiteInfoService } from '../site';
import { ensurePathExists } from '../utils/ensurePath';

const DEFAULT_SITES_DIST_PATH = '.sitecore/sites.json';

/**
 * Configuration object for generating sites.
 */
export type GenerateSitesConfig = {
  /**
   * Indicates if multisite support is enabled.
   */
  multisiteEnabled: boolean;
  /**
   * The default site name.
   */
  defaultSite: SiteInfo;
  /**
   * The SiteInfo service.
   */
  siteInfoService: GraphQLSiteInfoService;

  /**
   * Optional path where the generated sites will be saved.
   * If not provided, the default '.sitecore/sites.json' will be used.
   */
  destinationPath?: string;
};

/**
 * Generates site information and writes it to a specified destination path.
 * @param {GenerateSitesConfig} config - The configuration for generating site info.
 * @param {GraphQLSiteInfoService} config.siteInfoService - The service used to fetch site information.
 * @param {string} config.destinationPath - The optional path where the generated sites file will be written. Defaults to '.sitecore/sites.json'.
 * @returns {Promise<Function>} - A promise that resolves to an asynchronous function that fetches site information and writes it to a file.
 */
export const generateSites = ({
  multisiteEnabled,
  defaultSite,
  siteInfoService,
  destinationPath,
}: GenerateSitesConfig): (() => Promise<void>) => {
  return async () => {
    let sites: SiteInfo[] = [];
    const sitesFilePath = path.resolve(destinationPath ?? DEFAULT_SITES_DIST_PATH);

    if (multisiteEnabled) {
      try {
        console.log('Fetching site information');
        sites = await siteInfoService.fetchSiteInfo();
      } catch (error) {
        console.error(chalk.red('Error fetching site information'));
        console.error(error);
      }
    }

    sites.unshift(defaultSite);

    ensurePathExists(sitesFilePath);

    console.log(`Writing site info to ${sitesFilePath}`);
    fs.writeFileSync(sitesFilePath, JSON.stringify(sites, null, 2), { encoding: 'utf8' });
  };
};
