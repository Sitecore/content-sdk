import { generateComponentBuilder } from '@sitecore-content-sdk/nextjs/tools';
import {
  ComponentBuilderPluginConfig,
  ComponentBuilderPlugin as ComponentBuilderPluginType,
} from '..';

/**
 * Generates the component builder file.
 */
class ComponentBuilderPlugin implements ComponentBuilderPluginType {
  order = 9999;

  exec(config: ComponentBuilderPluginConfig) {
    generateComponentBuilder(config);

    return config;
  }
}

export const componentBuilderPlugin = new ComponentBuilderPlugin();
