import { Routes } from '@angular/router';
import { PageComponent } from './pages/page.component';
import { NotFoundComponent } from './pages/not-found.component';
import { ErrorComponent } from './pages/error.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '500',
        component: ErrorComponent,
      },
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '**',
        component: PageComponent,
      },
    ],
  },
];
