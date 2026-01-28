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
   * The Sitecore configuration used at build and run time.
   * @deprecated Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
   */
  scConfig?: SitecoreConfig;

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
  scConfig: deprecatedScConfig,
  destinationPath,
}: GenerateSitesConfig = {}): (() => Promise<void>) => {
  return async ({ scConfig }: { scConfig?: GenerateSitesConfig['scConfig'] } = {}) => {
    const config = deprecatedScConfig ?? scConfig;

    if (!config) {
      throw new Error('Sitecore configuration is required to be provided');
    }

    let sites: SiteInfo[] = [];
    const sitesFilePath = path.resolve(destinationPath ?? DEFAULT_SITES_DIST_PATH);

    debug.multisite(
      config.multisite.enabled
        ? 'Multisite Enabled: Generating site information'
        : 'Multisite Disabled'
    );

    if (config.multisite.enabled) {
      try {
        const siteInfoService = new SiteInfoService({
          clientFactory: createGraphQLClientFactory({
            api: config.api,
            retries: config.retries.count,
            retryStrategy: config.retries.retryStrategy,
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
      name: config.defaultSite,
      hostName: '*',
      language: config.defaultLanguage,
    };
    sites.unshift(defaultSite);

    ensurePathExists(sitesFilePath);

    fs.writeFileSync(sitesFilePath, JSON.stringify(sites, null, 2), { encoding: 'utf8' });
  };
};
