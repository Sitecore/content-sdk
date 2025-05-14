import chalk from 'chalk';
import {
  LayoutServiceData,
  ComponentRendering,
  PlaceholdersData,
} from '@sitecore-content-sdk/core/layout';
import {
  ComponentPropsCollection,
  ComponentPropsFetchFunction,
  NextContext,
  NextjsJssComponent,
} from '../sharedTypes/component-props';
import { ComponentMap } from '@sitecore-content-sdk/react';

export type FetchComponentPropsArguments = {
  layoutData: LayoutServiceData;
  context: NextContext;
  components: ComponentMap<NextjsJssComponent>;
};

export type ComponentPropsRequest = {
  fetch: ComponentPropsFetchFunction;
  layoutData: LayoutServiceData;
  rendering: ComponentRendering;
  context: NextContext;
};

export class ComponentPropsService {
  async fetchComponentProps(
    params: FetchComponentPropsArguments
  ): Promise<ComponentPropsCollection> {
    const { layoutData, context, components } = params;
    const requests = await this.collectRequests({
      placeholders: layoutData.sitecore.route?.placeholders,
      components,
      layoutData,
      context,
    });
    return await this.execRequests(requests);
  }

  /**
   * Go through layout service data, check all renderings using displayName, which should make some side effects.
   * Write result in requests variable
   * @param {object} params params
   * @param {PlaceholdersData} [params.placeholders]
   * @param {ComponentMap} params.components
   * @param {LayoutServiceData} params.layoutData
   * @param {NextContext} params.context
   * @param {ComponentPropsRequest[]} params.requests
   * @returns {ComponentPropsRequest[]} array of requests
   */
  protected async collectRequests(params: {
    placeholders?: PlaceholdersData;
    components: ComponentMap<NextjsJssComponent>;
    layoutData: LayoutServiceData;
    context: NextContext;
    requests?: ComponentPropsRequest[];
  }): Promise<ComponentPropsRequest[]> {
    const { placeholders = {}, components, layoutData, context } = params;

    // Will be called on first round
    if (!params.requests) {
      params.requests = [];
    }

    const renderings = this.flatRenderings(placeholders);

    const actions = renderings.map(async (r) => {
      const fetchFunc = (await this.getModule(components, r.componentName))
        ?.getComponentServerProps;

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
   * @param {ComponentPropsRequest[]} requests requests
   * @returns {Promise<ComponentPropsCollection>} requests result
   */
  protected async execRequests(
    requests: ComponentPropsRequest[]
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

  private async getModule(components: ComponentMap<NextjsJssComponent>, componentName: string) {
    const component = components.get(componentName);

    if (!component) return null;

    const module = component.dynamicModule ? await component?.dynamicModule?.() : component;
    return module as NextjsJssComponent;
  }
}
