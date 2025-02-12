import { ConfigPlugin } from '..';
import { JssConfigInput } from '@sitecore-jss/sitecore-jss-nextjs';

/**
 * This plugin will set config props used by the Sitecore Edge Platform.
 */
class EdgePlatformPlugin implements ConfigPlugin {
  order = 2;

  async exec(config: JssConfigInput) {
    const sitecoreEdgeUrl = config.api?.edgeUrl || 'https://edge-platform.sitecorecloud.io';
    const sitecoreEdgeContextId = config.api.contextId;

    return Object.assign({}, config, {
      sitecoreEdgeUrl,
      sitecoreEdgeContextId,
    });
  }
}

export const edgePlatformPlugin = new EdgePlatformPlugin();
