import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // {
  //   path: '**',
  //   renderMode: RenderMode.Prerender,

  //   getPrerenderParams: async () => ([
  //     { "**": "/" },
  //     { "**": "/about" },
  //     { "**": "/404" },
  //   ])
  // },
  {
    path: '**',
    renderMode: RenderMode.Server,
  }
];
