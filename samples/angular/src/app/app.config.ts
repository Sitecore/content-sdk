import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideSitecoreContentSdk, handleNavigationError } from '@sitecore-content-sdk/angular';

// Import the component map
import { componentMap } from '../../.sitecore/component-map';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withNavigationErrorHandler(
        handleNavigationError({ notFoundRoute: '/404', internalServerErrorRoute: '/500' })
      )
    ),
    provideClientHydration(withEventReplay()),
    provideSitecoreContentSdk({
      componentMap,
    }),
  ],
};
