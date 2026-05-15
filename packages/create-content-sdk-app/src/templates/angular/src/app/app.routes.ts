import { Routes } from '@angular/router';
import {
  createLocaleErrorMatcher,
  createLocaleMatcher,
  loaderResolver,
} from '@sitecore-content-sdk/angular';
import scConfig from '../../sitecore.config';
import { PageComponent } from './pages/page.component';
import { NotFoundComponent } from './pages/not-found.component';
import { ErrorComponent } from './pages/error.component';

const localeMatcher = createLocaleMatcher(scConfig.locales);
const notFoundMatcher = createLocaleErrorMatcher(scConfig.locales, '404');
const errorMatcher = createLocaleErrorMatcher(scConfig.locales, '500');

export const routes: Routes = [
  {
    matcher: errorMatcher,
    component: ErrorComponent,
    resolve: {
      page: loaderResolver('500'),
      dictionary: loaderResolver('dictionary'),
    },
  },
  {
    matcher: notFoundMatcher,
    component: NotFoundComponent,
    resolve: {
      page: loaderResolver('404'),
      dictionary: loaderResolver('dictionary'),
    },
  },
  {
    matcher: localeMatcher,
    component: PageComponent,
    resolve: {
      page: loaderResolver('page'),
      dictionary: loaderResolver('dictionary'),
    },
  },
];
