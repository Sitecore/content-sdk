/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import type { CanMatchFn, Routes, UrlMatcher, UrlSegment } from '@angular/router';
import { matchRouteChain } from './route-matcher';

function segments(path: string): UrlSegment[] {
  const parts = path.split('/').filter(Boolean);
  return parts.map((p) => ({ path: p, parameters: {} }) as UrlSegment);
}

function localeMatcher(locales: string[]): UrlMatcher {
  return (segs: UrlSegment[]) => {
    if (segs.length > 0 && locales.includes(segs[0].path)) {
      return { consumed: [segs[0]], posParams: { locale: segs[0] } };
    }
    return { consumed: [] };
  };
}

describe('matchRouteChain', () => {
  it('matches a static top-level route', () => {
    const routes: Routes = [{ path: '404' }, { path: '500' }];

    const chain = matchRouteChain(routes, segments('/404'));

    expect(chain).not.toBeNull();
    expect(chain).toHaveLength(1);
    expect(chain?.[0].route.path).toBe('404');
    expect(chain?.[0].params).toEqual({});
  });

  it('matches through a custom locale matcher into a wildcard child', () => {
    const routes: Routes = [
      {
        matcher: localeMatcher(['en', 'fr']),
        children: [
          { path: '404' },
          { path: '**', resolve: { page: () => {} } },
        ],
      },
    ];

    const chain = matchRouteChain(routes, segments('/en/about/us'));

    expect(chain).not.toBeNull();
    expect(chain).toHaveLength(2);
    expect(chain?.[0].params).toEqual({ locale: 'en' });
    expect(chain?.[1].route.path).toBe('**');
  });

  it('matches an unprefixed URL through the same locale-matcher tree (matcher still matches, consumes nothing)', () => {
    const routes: Routes = [
      {
        matcher: localeMatcher(['en', 'fr']),
        children: [{ path: '**', resolve: { page: () => {} } }],
      },
    ];

    const chain = matchRouteChain(routes, segments('/about'));

    expect(chain).not.toBeNull();
    expect(chain?.[0].params).toEqual({});
  });

  it('matches the home page (zero segments) through a locale-matcher parent into its wildcard child, not the parent alone', () => {
    // Regression test: with zero segments, a matcher-based parent (e.g. scLocaleMatcher)
    // can "match" by consuming nothing, leaving `remaining` empty too. Children must still
    // be tried in that case — the parent itself carries no resolvers here.
    const routes: Routes = [
      {
        matcher: localeMatcher(['en', 'fr']),
        children: [
          { path: '404' },
          { path: '**', resolve: { page: () => {}, dictionary: () => {} } },
        ],
      },
    ];

    const chain = matchRouteChain(routes, segments('/'));

    expect(chain).not.toBeNull();
    expect(chain).toHaveLength(2);
    expect(chain?.[0].params).toEqual({});
    expect(chain?.[1].route.path).toBe('**');
    expect(chain?.[1].route.resolve).toBeDefined();
  });

  it('matches a bare locale URL (e.g. "/en") into its wildcard child, not the locale-matcher parent alone', () => {
    const routes: Routes = [
      {
        matcher: localeMatcher(['en', 'fr']),
        children: [{ path: '**', resolve: { page: () => {} } }],
      },
    ];

    const chain = matchRouteChain(routes, segments('/en'));

    expect(chain).not.toBeNull();
    expect(chain).toHaveLength(2);
    expect(chain?.[0].params).toEqual({ locale: 'en' });
    expect(chain?.[1].route.path).toBe('**');
  });

  it('mirrors the starter template shape: home page resolves through the locale matcher to page + dictionary loaders', () => {
    const errorRoutes: Routes = [
      { path: '500' },
      { path: '404' },
      { path: ':locale/500' },
      { path: ':locale/404' },
    ];
    const routes: Routes = [
      ...errorRoutes,
      {
        matcher: localeMatcher(['en', 'da']),
        children: [
          { path: 'admin/cache' },
          { path: '500' },
          { path: '404' },
          { path: '**', resolve: { page: () => {}, dictionary: () => {} } },
        ],
      },
    ];

    const chain = matchRouteChain(routes, segments('/'));

    expect(chain).not.toBeNull();
    expect(chain?.[chain!.length - 1].route.resolve).toBeDefined();
  });

  it('merges params across matched levels (parent + child)', () => {
    const routes: Routes = [
      {
        path: 'team/:teamId',
        children: [{ path: 'user/:userId' }],
      },
    ];

    const chain = matchRouteChain(routes, segments('/team/33/user/11'));

    expect(chain).not.toBeNull();
    expect(chain).toHaveLength(2);
    expect(chain?.[0].params).toEqual({ teamId: '33' });
    expect(chain?.[1].params).toEqual({ userId: '11' });
  });

  it('fails a pathMatch:"full" route when segments remain, falling through to the next sibling', () => {
    const routes: Routes = [{ path: 'foo', pathMatch: 'full' }, { path: '**' }];

    const chain = matchRouteChain(routes, segments('/foo/bar'));

    expect(chain).not.toBeNull();
    expect(chain?.[0].route.path).toBe('**');
  });

  it('skips redirectTo routes and falls through to the next sibling', () => {
    const routes: Routes = [
      { path: 'old-page', redirectTo: '/new-page' },
      { path: 'old-page' },
    ];

    const chain = matchRouteChain(routes, segments('/old-page'));

    expect(chain).not.toBeNull();
    expect(chain?.[0].route.redirectTo).toBeUndefined();
  });

  it('skips canMatch-gated routes without invoking the guard', () => {
    const guard: CanMatchFn = () => {
      throw new Error('guard should never be invoked by the matcher');
    };
    const routes: Routes = [
      { path: 'secret', canMatch: [guard] },
      { path: 'secret' },
    ];

    const chain = matchRouteChain(routes, segments('/secret'));

    expect(chain).not.toBeNull();
    expect(chain?.[0].route.canMatch).toBeUndefined();
  });

  it('stops at a loadChildren-only route instead of throwing', () => {
    const routes: Routes = [{ path: 'lazy', loadChildren: () => Promise.resolve([]) }];

    const chain = matchRouteChain(routes, segments('/lazy/deep/path'));

    expect(chain).not.toBeNull();
    expect(chain).toHaveLength(1);
    expect(chain?.[0].route.path).toBe('lazy');
  });

  it('uses first-match-wins ordering', () => {
    const routes: Routes = [{ path: '**', data: { which: 'first' } }, { path: '**', data: { which: 'second' } }];

    const chain = matchRouteChain(routes, segments('/anything'));

    expect(chain?.[0].route.data).toEqual({ which: 'first' });
  });

  it('returns null when no route matches', () => {
    const routes: Routes = [{ path: '404' }, { path: '500' }];

    const chain = matchRouteChain(routes, segments('/does-not-exist'));

    expect(chain).toBeNull();
  });

  it('returns null for an empty route config', () => {
    expect(matchRouteChain([], segments('/anything'))).toBeNull();
  });
});
