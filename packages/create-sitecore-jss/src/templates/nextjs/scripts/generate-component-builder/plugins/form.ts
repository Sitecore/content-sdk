import { ComponentBuilderPlugin, ComponentBuilderPluginConfig } from '..';

/**
 * Provides Form component configuration
 */
class FormPlugin implements ComponentBuilderPlugin {
  order = 1;

  exec(config: ComponentBuilderPluginConfig) {
    config.packages.push({
      name: '@sitecore-content-sdk/nextjs',
      components: [
        {
          componentName: 'Form',
          moduleName: 'Form',
        },
      ],
    });

    return config;
  }
}

export const formPlugin = new FormPlugin();
