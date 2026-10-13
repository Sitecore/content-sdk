import { NextjsInit } from './initializers/nextjs';
import { NextjsAppRouterInit } from './initializers/nextjs-app-router';
import { NextjsAppRouterCacheComponentsInit } from './initializers/nextjs-app-router-cache-components';

/**
 * Initializers provided by this package, one per template.
 * create-content-sdk-app discovers and lazily loads this array, keying on each
 * initializer's `name`.
 */
const initializers = [NextjsInit, NextjsAppRouterInit, NextjsAppRouterCacheComponentsInit];

export default initializers;
