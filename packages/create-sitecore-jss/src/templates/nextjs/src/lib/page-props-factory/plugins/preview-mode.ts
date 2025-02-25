import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import {
  SiteInfo,
  personalizeLayout,
  getGroomedVariantIds,
  RestComponentLayoutService,
} from '@sitecore-content-sdk/nextjs';
import {
  EditingPreviewData,
  isComponentLibraryPreviewData,
} from '@sitecore-content-sdk/nextjs/editing';
import { SitecorePageProps } from 'lib/page-props';
import { graphQLEditingService } from 'lib/graphql-editing-service';
import { Plugin } from '..';
import config from 'sitecore.config';

class PreviewModePlugin implements Plugin {
  order = 1;

  async exec(props: SitecorePageProps, context: GetServerSidePropsContext | GetStaticPropsContext) {
    if (!context.preview || !context.previewData) return props;

    if (isComponentLibraryPreviewData(context.previewData)) {
      if (!config.api.local) {
        throw new Error('Component Library requires Sitecore apiHost and apiKey to be provided');
      }
      const { itemId, componentUid, site, language, renderingId, dataSourceId, version } =
        context.previewData;

      const componentService = new RestComponentLayoutService({
        apiHost: config.api.local?.apiHost,
        apiKey: config.api.local?.apiKey,
        siteName: site,
      });

      const componentData = await componentService.fetchComponentData({
        siteName: site,
        itemId,
        language,
        componentUid,
        renderingId,
        dataSourceId,
        version,
      });

      // we can reuse editing service, fortunately
      const dictionaryData = await graphQLEditingService.fetchDictionaryData({
        siteName: site,
        language,
      });

      if (!componentData) {
        throw new Error(
          `Unable to fetch editing data for preview ${JSON.stringify(context.previewData)}`
        );
      }

      props.locale = context.previewData.language;
      props.layoutData = componentData;
      props.headLinks = [];
      props.dictionary = dictionaryData;

      return props;
    }

    // If we're in Pages preview (editing) mode, prefetch the editing data
    const { site, itemId, language, version, variantIds, layoutKind } =
      context.previewData as EditingPreviewData;

    const data = await graphQLEditingService.fetchEditingData({
      siteName: site,
      itemId,
      language,
      version,
      layoutKind,
    });

    if (!data) {
      throw new Error(
        `Unable to fetch editing data for preview ${JSON.stringify(context.previewData)}`
      );
    }

    props.site = data.layoutData.sitecore.context.site as SiteInfo;
    props.locale = language;
    props.layoutData = data.layoutData;
    props.dictionary = data.dictionary;
    props.headLinks = [];
    const personalizeData = getGroomedVariantIds(variantIds);
    personalizeLayout(
      props.layoutData,
      personalizeData.variantId,
      personalizeData.componentVariantIds
    );

    return props;
  }
}

export const previewModePlugin = new PreviewModePlugin();
