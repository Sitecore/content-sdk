import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import chalk from 'chalk';
import {
  LayoutServiceData,
  ComponentRendering,
  PlaceholdersData,
} from '@sitecore-content-sdk/core/layout';
import {
  ComponentPropsCollection,
  ComponentPropsFetchFunction,
  LazyModule,
  NextjsComponent,
  NextjsModule,
} from '../sharedTypes/component-props';
import { ComponentMap } from '@sitecore-content-sdk/react';

export type FetchComponentPropsArguments<NextContext> = {
  layoutData: LayoutServiceData;
  context: NextContext;
  components: ComponentMap<NextjsComponent>;
};

export type ComponentPropsRequest<NextContext> = {
  fetch: ComponentPropsFetchFunction<NextContext>;
  layoutData: LayoutServiceData;
  rendering: ComponentRendering;
  context: NextContext;
};

type FetchFunctionFactory<NextContext> = (
  componentName: string
) => Promise<ComponentPropsFetchFunction<NextContext> | undefined>;

export class ComponentPropsService {
  async fetchComponentProps(
    params: FetchComponentPropsArguments<GetServerSidePropsContext | GetStaticPropsContext>
  ): Promise<ComponentPropsCollection> {
    const { layoutData, context, components } = params;
    if (this.isServerSidePropsContext(context)) {
      const fetchFunctionFactory = async (componentName: string) =>
        ((await this.getModule(components, componentName)) as NextjsModule)?.getServerSideProps;
      const requests = await this.collectRequests({
        placeholders: layoutData.sitecore.route?.placeholders,
        fetchFunctionFactory,
        layoutData,
        context,
      });
      return await this.execRequests(requests);
    } else {
      const fetchFunctionFactory = async (componentName: string) =>
        ((await this.getModule(components, componentName)) as NextjsModule)?.getStaticProps;

      const requests = await this.collectRequests({
        placeholders: layoutData.sitecore.route?.placeholders,
        fetchFunctionFactory,
        layoutData,
        context,
      });
      return await this.execRequests(requests);
    }
  }

  /**
   * Go through layout service data, check all renderings using displayName, which should make some side effects.
   * Write result in requests variable
   * @param {object} params params
   * @param {PlaceholdersData} [params.placeholders]
   * @param {FetchFunctionFactory<NextContext>} params.fetchFunctionFactory
   * @param {LayoutServiceData} params.layoutData
   * @param {NextContext} params.context
   * @param {ComponentPropsRequest<NextContext>[]} params.requests
   * @returns {ComponentPropsRequest<NextContext>[]} array of requests
   */
  protected async collectRequests<NextContext>(params: {
    placeholders?: PlaceholdersData;
    fetchFunctionFactory: FetchFunctionFactory<NextContext>;
    layoutData: LayoutServiceData;
    context: NextContext;
    requests?: ComponentPropsRequest<NextContext>[];
  }): Promise<ComponentPropsRequest<NextContext>[]> {
    const { placeholders = {}, fetchFunctionFactory, layoutData, context } = params;

    // Will be called on first round
    if (!params.requests) {
      params.requests = [];
    }

    const renderings = this.flatRenderings(placeholders);

    const actions = renderings.map(async (r) => {
      const fetchFunc = await fetchFunctionFactory(r.componentName);

      if (fetchFunc) {
        params.requests &&
          params.requests.push({
            fetch: fetchFunc,
            rendering: r,
            layoutData: layoutData,
            context,
          });
      }

      // If placeholders exist in current rendering
      if (r.placeholders) {
        await this.collectRequests({
          ...params,
          placeholders: r.placeholders,
        });
      }
    });

    await Promise.all(actions);

    return params.requests;
  }

  /**
   * Execute request for component props
   * @param {ComponentPropsRequest<NextContext>[]} requests requests
   * @returns {Promise<ComponentPropsCollection>} requests result
   */
  protected async execRequests<NextContext>(
    requests: ComponentPropsRequest<NextContext>[]
  ): Promise<ComponentPropsCollection> {
    const componentProps: ComponentPropsCollection = {};

    const promises = requests.map((req) => {
      const { uid } = req.rendering;

      if (!uid) {
        console.log(
          `Component ${req.rendering.componentName} doesn't have uid, can't store data for this component`
        );
        return;
      }

      return req
        .fetch(req.rendering, req.layoutData, req.context)
        .then((result) => {
          // Set component specific data in componentProps store
          componentProps[uid] = result;
        })
        .catch((error) => {
          const errLog = `Error during preload data for component ${
            req.rendering.componentName
          } (${uid}): ${error.message || error}`;

          console.error(chalk.red(errLog));

          componentProps[uid] = {
            error: error.message || errLog,
            componentName: req.rendering.componentName,
          };
        });
    });

    await Promise.all(promises);

    return componentProps;
  }

  /**
   * Take renderings from all placeholders and returns a flat array of renderings.
   * @example
   * const placeholders = {
   *    x1: [{ uid: 1 }, { uid: 2 }],
   *    x2: [{ uid: 11 }, { uid: 22 }]
   * }
   *
   * flatRenderings(placeholders);
   *
   * RESULT: [{ uid: 1 }, { uid: 2 }, { uid: 11 }, { uid: 22 }]
   * @param {PlaceholdersData} placeholders placeholders
   * @returns {ComponentRendering[]} renderings
   */
  protected flatRenderings(placeholders: PlaceholdersData): ComponentRendering[] {
    const allComponentRenderings: ComponentRendering[] = [];
    const placeholdersArr = Object.values(placeholders);

    placeholdersArr.forEach((pl) => {
      const renderings = pl as ComponentRendering[];
      allComponentRenderings.push(...renderings);
    });

    return allComponentRenderings;
  }

  // TODO: remove when unifying server/static component props
  /**
   * Determines whether context is GetServerSidePropsContext (SSR) or GetStaticPropsContext (SSG)
   * @param {GetServerSidePropsContext | GetStaticPropsContext} context
   */
  private isServerSidePropsContext(
    context: GetServerSidePropsContext | GetStaticPropsContext
  ): context is GetServerSidePropsContext {
    return (<GetServerSidePropsContext>context).req !== undefined;
  }

  private async getModule(components: ComponentMap<NextjsComponent>, componentName: string) {
    const component = components.get(componentName);

    if (!component) return null;

    const module = ((component as unknown) as LazyModule).module
      ? await ((component as unknown) as LazyModule).module()
      : component;
    return module;
  }
}
