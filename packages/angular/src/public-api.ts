/**
 * Public API Surface of @sitecore-content-sdk/angular
 */

import { VERSION as CORE_VERSION } from '@angular/core';
import { Router } from '@angular/router';

export * from '@sitecore-content-sdk/content/client';
export * from '@sitecore-content-sdk/content/config';


// Angular-specific exports
export * from './loaders/loader-resolver';
export * from './loaders/loader-registry.token';
export * from './loaders/loader-prefetch.config';
export * from './loaders/loader-data.service';

export * from './server';

export const _coreVersionMarker = CORE_VERSION;
export const _routerTokenMarker = Router;
