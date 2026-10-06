import { AngularInit } from './initializers/angular';

/**
 * Initializers provided by this package, one per template.
 * create-content-sdk-app discovers and lazily loads this array, keying on each
 * initializer's `name`.
 */
const initializers = [AngularInit];

export default initializers;
