import type { Params } from '@angular/router';

export type LoaderApiRequest = {
  loaderId: string;
  url: string;
  params: Params;
  query: Record<string, any>;
};

export type LoaderApiResponse =
  | { kind: 'data'; data: any }
  | { kind: 'redirect'; location: string; status: number }
  | { kind: 'error'; status: number; message: string }
  | { kind: 'notFound'; status: number };
