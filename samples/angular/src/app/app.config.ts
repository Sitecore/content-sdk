import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  LOADER_REGISTRY,
  COMPONENT_MAP,
  handleNavigationError,
} from '@sitecore-content-sdk/angular';

// Import the loaders
import { SERVER_LOADERS } from '../lib/loaders';

// Import the component map
import { componentMap } from '../../.sitecore/component-map';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withNavigationErrorHandler(
        handleNavigationError({ notFoundRoute: '/404', internalServerErrorRoute: '/500' })
      )
    ),
    provideClientHydration(withEventReplay()),
    { provide: LOADER_REGISTRY, useValue: SERVER_LOADERS },
    { provide: COMPONENT_MAP, useValue: componentMap },
  ],
};
