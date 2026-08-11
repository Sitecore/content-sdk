import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import { ensurePathExists } from '@sitecore-content-sdk/core/node-tools';
import { constants } from '@sitecore-content-sdk/core';
import { SiteInfo, SiteInfoService } from '../site';
import { SitecoreConfig } from '../config';
import { createCliGraphQLClientFactory } from '../client';
import debug from '../debug';

const { ERROR_MESSAGES } = constants;
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
export const generateSites = ({ destinationPath }: GenerateSitesConfig = {}): ((args: {
  scConfig: SitecoreConfig;
}) => Promise<void>) => {
  return async ({ scConfig }: { scConfig: SitecoreConfig }) => {
    if (!scConfig) {
      throw new Error(ERROR_MESSAGES.MV_008);
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
          clientFactory: createCliGraphQLClientFactory({
            api: scConfig.api,
            retries: scConfig.retries.count,
            retryStrategy: scConfig.retries.retryStrategy,
          }),
        });

        sites = await siteInfoService.fetchSiteInfo();
      } catch (error) {
        console.error(
          chalk.red(`Failed to fetch site information. ${ERROR_MESSAGES.CONTACT_SUPPORT}`)
        );
        throw error;
      }
    }

    if (scConfig.defaultSite?.trim()) {
      const defaultSite: SiteInfo = {
        name: scConfig.defaultSite,
        hostName: '*',
        language: scConfig.defaultLanguage,
      };
      sites.unshift(defaultSite);
    }

    ensurePathExists(sitesFilePath);

    fs.writeFileSync(sitesFilePath, JSON.stringify(sites, null, 2), { encoding: 'utf8' });
  };
};
