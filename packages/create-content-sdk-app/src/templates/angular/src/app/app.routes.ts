import { Routes } from '@angular/router';
import { loaderResolver } from '@sitecore-content-sdk/angular';
import { PageComponent } from './pages/page.component';
import { NotFoundComponent } from './pages/not-found.component';
import { ErrorComponent } from './pages/error.component';
import { CacheDemoComponent } from './admin/cache-demo.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'admin/cache',
        component: CacheDemoComponent,
      },
      {
        path: '500',
        component: ErrorComponent,
        resolve: { page: loaderResolver('500') },
      },
      {
        path: '404',
        component: NotFoundComponent,
        resolve: { page: loaderResolver('404') },
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
