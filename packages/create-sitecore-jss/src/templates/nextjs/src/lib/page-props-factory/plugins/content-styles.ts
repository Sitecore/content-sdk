import { SitecorePageProps } from 'lib/page-props';
import { getContentStylesheetLink } from '@sitecore-content-sdk/nextjs';
import { Plugin } from '..';
import { runtimeConfig as config } from '@sitecore-content-sdk/nextjs/config';

class ContentStylesPlugin implements Plugin {
  order = 2;

  async exec(props: SitecorePageProps) {
    // Get content stylessheet link, empty if styles are not used on the page
    const contentStyles = getContentStylesheetLink(
      props.layoutData,
      config.api?.edge?.contextId,
      config.api?.edge?.edgeUrl
    );

    if (contentStyles) props.headLinks.push(contentStyles);

    return props;
  }
}

export const contentStylesPlugin = new ContentStylesPlugin();
