import type { Params } from '@angular/router';

export type LoaderContext = {
  url: string;
  params: Params;
  query: Record<string, string | string[]>;
  req?: Request; // only on server
  res?: Response; // only on server
};

export type LoaderFn<T = unknown> = (ctx: LoaderContext) => Promise<T> | T;
