import { RouteOptions, LayoutServiceData } from './models.js';
import { SitecoreServiceBase } from '../sitecore-service-base.js';
import { FetchOptions } from '../models.js';

/**
 * Base abstraction to implement custom layout service
 */
export abstract class LayoutServiceBase extends SitecoreServiceBase {
  abstract fetchLayoutData(
    itemPath: string,
    routeOptions: RouteOptions,
    fetchOptions: FetchOptions
  ): Promise<LayoutServiceData>;
}
