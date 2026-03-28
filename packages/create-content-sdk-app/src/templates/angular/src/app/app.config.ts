import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideLoaderRegistry,
  handleNavigationError,
  provideSitecoreAngular,
  PreLoaderDataService,
} from '@sitecore-content-sdk/angular';
import { routes } from './app.routes';
import scConfig from '../../sitecore.config';
import { LOADERS } from '../content-sdk/loaders';

/**
 * Client hydration is disabled so that RouterLink and other directives attach correctly
 * after bootstrap. With provideClientHydration(), server-rendered DOM is reused and
 * directive event listeners (e.g. RouterLink click) can fail to attach. Without
 * hydration, the client re-renders the app and routing works as expected.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withNavigationErrorHandler(handleNavigationError())),
    provideSitecoreAngular({
      notFoundRoute: '/404',
      errorRoute: '/500',
      sitecoreConfig: scConfig,
    }),
    provideLoaderRegistry(LOADERS),
    PreLoaderDataService,
  ],
};
