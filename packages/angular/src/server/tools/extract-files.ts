import {
  extractFiles as contentExtractFiles,
  ExtractFilesConfig,
} from '@sitecore-content-sdk/content/node-tools';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import type { AngularSitecoreConfig } from '../../config/define-config';
import { gatherAngularCompanionFiles } from './angular-source-utils';

/**
 * Angular build-time **code extraction** command. Parses `.sitecore/component-map.ts`, resolves
 * every referenced component source file, and POSTs the source (plus `package.json`) to the
 * XM Cloud Edge mesh endpoint. Runs only in a deploy context (see `validateDeployContext`).
 *
 * Reuses the shared extractor in `@sitecore-content-sdk/content`, injecting Angular-specific
 * companion-file gathering ({@link gatherAngularCompanionFiles} — external `templateUrl` /
 * `styleUrls`). Angular has no server/client component split, so no client component map is used.
 * @param {ExtractFilesConfig} args - extraction config; `gatherCompanionFiles` defaults to the Angular gatherer
 * @returns build command invoked by `sitecore-tools build` with the resolved Angular config
 * @public
 */
export const extractFiles = (
  args: ExtractFilesConfig = {}
): ((ctx: { scConfig: AngularSitecoreConfig }) => Promise<void>) => {
  const run = contentExtractFiles({
    gatherCompanionFiles: gatherAngularCompanionFiles,
    ...args,
  });
  // AngularSitecoreConfig is a structural superset of SitecoreConfig (see define-cli-config.ts).
  return async ({ scConfig }: { scConfig: AngularSitecoreConfig }) =>
    run({ scConfig: scConfig as SitecoreConfig });
};

export type { ExtractFilesConfig };
