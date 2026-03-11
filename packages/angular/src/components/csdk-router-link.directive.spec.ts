import { Component } from '@angular/core';
import {
  TestBed,
  getTestBed,
} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { CSDKRouterLinkDirective } from './csdk-router-link.directive';
import { LoaderDataService } from '../loaders/loader-data.service';
import { LOADER_ID } from '../loaders/utils';

beforeAll(() => {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserTesting()
  );
});

function createMockResolver(loaderId: string): () => void {
  const fn = () => {};
  (fn as Record<symbol, string>)[LOADER_ID] = loaderId;
  return fn;
}

const routes = [
  {
    path: '**',
    resolve: { page: createMockResolver('page') },
  },
];

@Component({
  standalone: true,
  imports: [CSDKRouterLinkDirective],
  template: `<a csdkRouterLink [routerLink]="link" [attr.href]="href">Link</a>`,
})
class TestComponent {
  link = '/other';
  href = '/other';
}


describe('CSDKRouterLinkDirective', () => {
  let mockPrefetch: ReturnType<typeof vi.fn>;
  let mockRouter: {
    config: typeof routes;
    url: string;
    parseUrl: (url: string) => unknown;
    serializeUrl: (tree: unknown) => string;
  };

  beforeEach(() => {
    mockPrefetch = vi.fn();
    mockRouter = {
      config: routes as never,
      url: '/other',
      parseUrl: (url: string) => ({ _url: url }),
      serializeUrl: (tree: unknown) => (tree as { _url?: string })._url ?? '',
    };
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: LoaderDataService, useValue: { prefetch: mockPrefetch } },
      ],
    });
  });

  it('should do nothing in server context', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: LoaderDataService, useValue: { prefetch: mockPrefetch } },
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a');
    anchor.dispatchEvent(new Event('mouseenter'));

    expect(mockPrefetch).not.toHaveBeenCalled();
  });

  it('should prefetch data from loaderDataService on hover', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a');
    anchor.dispatchEvent(new Event('mouseenter'));

    expect(mockPrefetch).toHaveBeenCalledWith('/other', 'page', {}, {});
  });

  it('should do nothing when link leads to the current route', () => {
    mockRouter.url = '/same';

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.link = '/same';
    fixture.componentInstance.href = '/same';
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a');
    anchor.setAttribute('href', '/same');
    anchor.dispatchEvent(new Event('mouseenter'));

    expect(mockPrefetch).not.toHaveBeenCalled();
  });
});
