import { SitecorePageProps } from 'lib/page-props';
import { getComponentLibraryStylesheetLinks } from '@sitecore-content-sdk/nextjs';
import { Plugin } from '..';
import config from 'sitecore.config';

class ComponentThemesPlugin implements Plugin {
  // Make sure to run this plugin after the personalization plugin, since it relies on the layout data
  order = 10;

  async exec(props: SitecorePageProps) {
    // Collect SXA component themes
    props.headLinks.push(
      ...getComponentLibraryStylesheetLinks(
        props.layoutData,
        config.api.contextId,
        config.api.edgeUrl
      )
    );
    return props;
  }
}

export const componentThemesPlugin = new ComponentThemesPlugin();
