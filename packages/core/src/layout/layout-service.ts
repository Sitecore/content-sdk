import * as models from './models';
import { SitecoreServiceBase } from '../sitecore-service-base';
import { RouteOptions } from '../client';
import { FetchOptions } from '../models';

/**
 * Base abstraction to implement custom layout service
 */
export abstract class LayoutServiceBase extends SitecoreServiceBase {
  abstract fetchLayoutData(
    itemPath: string,
    routeOptions: RouteOptions,
    fetchOptions: FetchOptions
  ): Promise<models.LayoutServiceData>;
}
