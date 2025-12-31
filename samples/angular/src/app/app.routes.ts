import { Routes } from '@angular/router';
import { PageComponent } from './pages/page.component';
import { loaderResolver } from '@sitecore-content-sdk/angular';

export const routes: Routes = [
  {
    path: '404',
    component: PageComponent,
    resolve: {
      page: loaderResolver('404'),
    },
  },
  {
    path: '**',
    component: PageComponent,
    resolve: {
      page: loaderResolver('page'),
    },
  },
];
