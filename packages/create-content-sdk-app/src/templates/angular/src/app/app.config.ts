import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideSitecoreAngular } from '@sitecore-content-sdk/angular';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import scConfig from '../../sitecore.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideSitecoreAngular({ sitecoreConfig: scConfig }),
    provideClientHydration(withEventReplay()),
  ],
};
