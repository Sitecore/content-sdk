import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, UrlSerializer, withNavigationErrorHandler } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideLoaderRegistry,
  handleNavigationError,
  provideSitecoreAngular,
  ClientPreLoaderDataService,
  SITECORE_COMPONENT_MAP,
  SitecoreTranslateLoader,
  LocaleUrlSerializer,
  DESIGN_LIBRARY_IMPORT_MAP,
} from '@sitecore-content-sdk/angular';
import { routes } from './app.routes';
import scConfig from '../../sitecore.config';
import { getClient } from '../content-sdk/client/sitecore-client';
import { LOADERS } from '../content-sdk/loaders';
import { componentMap } from '.sitecore/component-map';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';

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
      sitecoreClient: getClient(),
    }),
    provideLoaderRegistry(LOADERS),
    ClientPreLoaderDataService,
    { provide: SITECORE_COMPONENT_MAP, useValue: componentMap },
    // Design Library variant-generation: lazily load the generated import map so it stays out of
    // the main bundle (only needed when previewing generated components).
    {
      provide: DESIGN_LIBRARY_IMPORT_MAP,
      useValue: () => import('.sitecore/import-map').then((m) => m.default),
    },
    provideTranslateService({
      loader: provideTranslateLoader(SitecoreTranslateLoader),
    }),
    // provides locale aware serializer for csdk and angular router links
    { provide: UrlSerializer, useClass: LocaleUrlSerializer },
  ],
};
