import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

import { SiteInfo, GraphQLSiteInfoService } from '../site';
import { ensurePathExists } from '../utils/utils';

/**
 * Configuration object for generating sites.
 */
export type GenerateSitesConfig = {
  /**
   * Indicates if multi-site generation is enabled.
   */
  multiSiteEnabled: boolean;
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
   * If not provided, the default 'src/temp/sites.js' will be used.
   */
  destinationPath?: string;
};

/**
 * Generates site information and writes it to a specified destination path.
 * @param {GenerateSitesConfig} config - The configuration for generating site info.
 * @param {GraphQLSiteInfoService} config.siteInfoService - The service used to fetch site information.
 * @param {string} config.destinationPath - The optional path where the generated sites file will be written. Defaults to 'src/temp/sites.js'.
 * @returns {Promise<Function>} - A promise that resolves to an asynchronous function that fetches site information and writes it to a file.
 */
export const generateSites = ({
  multiSiteEnabled,
  defaultSite,
  siteInfoService,
  destinationPath,
}: GenerateSitesConfig): (() => Promise<void>) => {
  return async () => {
    let sites: SiteInfo[] = [];
    const sitesFilePath = path.resolve(destinationPath ?? '.sitecore/sites.json');

    const outputDir = path.dirname(sitesFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (multiSiteEnabled) {
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
