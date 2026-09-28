import AngularInitializer from './initializers/angular';
import { Initializer } from './scaffolding';

export * from './scaffolding';

/**
 * Registry of template name -> initializer instance provided by this package.
 * create-content-sdk-app discovers and lazily loads this map.
 */
export const initializers: { [template: string]: Initializer } = {
  angular: new AngularInitializer(),
};
