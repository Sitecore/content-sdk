import { Route, Routes } from '@angular/router';
import { loaderResolver, scLocaleMatcher } from '@sitecore-content-sdk/angular';
import scConfig from '../../sitecore.config';
import { PageComponent } from './pages/page.component';
import { NotFoundComponent } from './pages/not-found.component';
import { ErrorComponent } from './pages/error.component';

/**
 * Error routes (`404` / `500`) live at the top level — both unprefixed and with a
 * `:locale` parameter segment — so that `@angular/ssr` can match its `ServerRoute`
 * entries by `path` and emit the correct HTTP status. The catchall page sits behind
 * `createLocaleMatcher`, which still consumes a configured locale (if present) and
 * exposes it as a `locale` route param to loaders.
 */
const errorRoutes: Route[] = [
  { path: '500', component: ErrorComponent, resolve: { page: loaderResolver('500') } },
  { path: '404', component: NotFoundComponent, resolve: { page: loaderResolver('404') } },
  { path: ':locale/500', component: ErrorComponent, resolve: { page: loaderResolver('500') } },
  { path: ':locale/404', component: NotFoundComponent, resolve: { page: loaderResolver('404') } },
];

export const routes: Routes = [
  ...errorRoutes,
  {
    matcher: scLocaleMatcher(scConfig.angular.locales),
    children: [
      {
        path: '**',
        component: PageComponent,
        resolve: {
          page: loaderResolver('page'),
          dictionary: loaderResolver('dictionary'),
        },
      },
    ],
  },
];
