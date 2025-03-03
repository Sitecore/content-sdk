import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

import { SiteInfo, GraphQLSiteInfoService } from '../site';

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
export const generateSites = async ({
  multiSiteEnabled,
  defaultSite,
  siteInfoService,
  destinationPath,
}: GenerateSitesConfig) => {
  return async () => {
    let sites: SiteInfo[] = [];
    const sitesFilePath = path.resolve(destinationPath ?? 'src/temp/sites.js');

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

    let sitesText = `/* eslint-disable */
                    // Do not edit this file, it is auto-generated at build time!
                    // See scripts/bootstrap.ts to modify the generation of this file.
                    const sites = ${JSON.stringify(sites)};\n`;

    sitesText += 'module.exports = sites;';

    console.log(`Writing fetched sites to ${sitesFilePath}`);

    await fs.promises.writeFile(sitesFilePath, sitesText, { encoding: 'utf8' });
  };
};
