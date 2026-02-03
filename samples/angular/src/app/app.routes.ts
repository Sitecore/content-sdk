import { Routes } from '@angular/router';
import { PageComponent } from './pages/page.component';
import { loaderResolver, languageMatcher } from '@sitecore-content-sdk/angular';

export const routes: Routes = [
  {
    matcher: languageMatcher(),
    children: [
      {
        path: '404',
        component: PageComponent,
        resolve: {
          page: loaderResolver('404'),
          dictionary: loaderResolver('dictionary'),
        },
      },
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
