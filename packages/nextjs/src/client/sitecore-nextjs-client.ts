import {
  FetchOptions,
  Page,
  SitecoreClient,
  SitecoreClientInit,
} from '@sitecore-content-sdk/core/client';
import { ComponentPropsCollection, ComponentPropsError } from '../sharedTypes/component-props';
import { GetServerSidePropsContext, GetStaticPropsContext, PreviewData } from 'next';
import { LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import {
  EditingPreviewData,
  GraphQLEditingService,
  isComponentLibraryPreviewData,
} from '../editing';
import { RestComponentLayoutService } from '@sitecore-content-sdk/core/editing';
import { SiteInfo } from '../site';
import { getGroomedVariantIds, personalizeLayout } from '@sitecore-content-sdk/core/personalize';
import { ComponentPropsService } from '../services/component-props-service';
import { ModuleFactory } from '../sharedTypes/module-factory';

export type SitecoreNexjtsClientInit = SitecoreClientInit & {
  moduleFactory: ModuleFactory;
};

export type NextjsPage = Page & {
  componentProps?: ComponentPropsCollection;
};

export class SitecoreNextjsClient extends SitecoreClient {
  protected editingService: GraphQLEditingService;
  protected componentPropsService: ComponentPropsService;
  constructor(protected initOptions: SitecoreNexjtsClientInit) {
    super(initOptions);
    this.editingService = new GraphQLEditingService({ clientFactory: this.clientFactory });
    this.componentPropsService = new ComponentPropsService();
  }

  async getPage(path: string, locale?: string, options?: FetchOptions): Promise<Page> {
    const page = (await super.getPage(path, locale, options)) as NextjsPage;
    if (!page.notFound) {
      // TODO: find a way to not use nextjs context here
      page.componentProps = {};
    }
    return page;
  }

  // TODO: make framework agnostic, move to core
  // TODO: map PreviewData to some general type
  async getPreview(previewData: PreviewData) {
    // TODO: break up into getPreview and getComponentLibrary
    if (isComponentLibraryPreviewData(previewData)) {
      if (!this.initOptions.api.local) {
        throw new Error('Component Library requires Sitecore apiHost and apiKey to be provided');
      }
      const {
        itemId,
        componentUid,
        site,
        language,
        renderingId,
        dataSourceId,
        version,
      } = previewData;

      const componentService = new RestComponentLayoutService({
        apiHost: this.initOptions.api.local?.apiHost,
        apiKey: this.initOptions.api.local?.apiKey,
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
      const dictionaryData = await this.editingService.fetchDictionaryData({
        siteName: site,
        language,
      });

      if (!componentData) {
        throw new Error(`Unable to fetch editing data for preview ${JSON.stringify(previewData)}`);
      }
      const page = {
        locale: previewData.language,
        layout: componentData,
        headLinks: this.getHeadLinks(componentData),
        dictionary: dictionaryData,
      } as NextjsPage;
      return page;
    }

    // If we're in Pages preview (editing) mode, prefetch the editing data
    const {
      site,
      itemId,
      language,
      version,
      variantIds,
      layoutKind,
    } = previewData as EditingPreviewData;

    const data = await this.editingService.fetchEditingData({
      siteName: site,
      itemId,
      language,
      version,
      layoutKind,
    });

    if (!data) {
      throw new Error(`Unable to fetch editing data for preview ${JSON.stringify(previewData)}`);
    }
    const page = {
      locale: language,
      layout: data.layoutData,
      headLinks: this.getHeadLinks(data.layoutData),
      dictionary: data.dictionary,
      site: data.layoutData.sitecore.context.site as SiteInfo,
    } as NextjsPage;
    const personalizeData = getGroomedVariantIds(variantIds);
    personalizeLayout(page.layout, personalizeData.variantId, personalizeData.componentVariantIds);

    return page;
  }

  // TODO: consider making generic and moving to core
  async getComponentData(
    layoutData: LayoutServiceData,
    context: GetServerSidePropsContext | GetStaticPropsContext
  ): Promise<ComponentPropsCollection> {
    let componentProps: ComponentPropsCollection = {};
    if (!layoutData.sitecore.route) return componentProps;
    // Retrieve component props using side-effects defined on components level
    if (this.isServerSidePropsContext(context)) {
      componentProps = await this.componentPropsService.fetchServerSideComponentProps({
        layoutData: layoutData,
        context,
        moduleFactory: this.initOptions.moduleFactory,
      });
    } else {
      componentProps = await this.componentPropsService.fetchStaticComponentProps({
        layoutData: layoutData,
        context,
        moduleFactory: this.initOptions.moduleFactory,
      });
    }

    const errors = Object.keys(componentProps)
      .map((id) => {
        const component = componentProps[id] as ComponentPropsError;

        return component.error
          ? `\nUnable to get component props for ${component.componentName} (${id}): ${component.error}`
          : '';
      })
      .join('');

    if (errors.length) {
      throw new Error(errors);
    }

    return componentProps;
  }

  /**
   * Determines whether context is GetServerSidePropsContext (SSR) or GetStaticPropsContext (SSG)
   * @param {GetServerSidePropsContext | GetStaticPropsContext} context
   */
  private isServerSidePropsContext(
    context: GetServerSidePropsContext | GetStaticPropsContext
  ): context is GetServerSidePropsContext {
    return (<GetServerSidePropsContext>context).req !== undefined;
  }
}
