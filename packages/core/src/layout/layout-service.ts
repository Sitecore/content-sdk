import * as models from './models';
import { SitecoreServiceBase } from '../models';

/**
 * Base abstraction to implement custom layout service
 */
export abstract class LayoutServiceBase extends SitecoreServiceBase {
  abstract fetchLayoutData(
    itemPath: string,
    language?: string,
    site?: string
  ): Promise<models.LayoutServiceData>;
}
