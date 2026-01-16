import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LOADER_REGISTRY, COMPONENT_MAP } from '@sitecore-content-sdk/angular';
// import { handleNavigationError } from '../lib/router-error-handling';

// Import the component map
import { componentMap } from '../../.sitecore/component-map';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes
      // withNavigationErrorHandler(
      //   handleNavigationError({ notFoundRoute: '/404', internalServerErrorRoute: '/500' })
      // )
    ),
    provideClientHydration(withEventReplay()),
    { provide: LOADER_REGISTRY, useValue: [] },
    { provide: COMPONENT_MAP, useValue: componentMap },
  ],
};
