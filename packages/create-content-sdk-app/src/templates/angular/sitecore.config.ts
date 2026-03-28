import { angularEnvToConfig, defineConfig } from '@sitecore-content-sdk/angular';
import { environment } from './src/environments/environment';

/**
 * Sitecore configuration. Spread {@link angularEnvToConfig} from `environment.ts`, then add overrides.
 * @see https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig({
  ...angularEnvToConfig(environment as { [key: string]: string | undefined }),
});