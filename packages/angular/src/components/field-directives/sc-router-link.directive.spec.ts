/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Component, input, type Provider } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { ScRouterLinkDirective } from './sc-router-link.directive';
import { ClientPreLoaderDataService } from '../../loaders/pre-loader-data.service';
import { SITECORE_CONFIG_TOKEN } from '../../lib/tokens';
import type { LinkPrefetchMode } from '../../config/define-config';
import type { LinkField } from '@sitecore-content-sdk/content/layout';

@Component({ standalone: true, template: '', selector: 'blank-cmp' })
class BlankCmp {}

@Component({
  selector: 'test-sc-router-link',
  imports: [ScRouterLinkDirective],
  template: `<a *scRouterLink="field(); prefetch: prefetchMode()">Label</a>`,
})
class TestScRouterLinkHost {
  readonly field = input<LinkField>({
    value: { href: '/about', text: 'About' },
  });
  readonly prefetchMode = input<LinkPrefetchMode | undefined>(undefined);
}

describe('ScRouterLinkDirective', () => {
  async function createFixture(
    extraProviders: Provider[] = [],
    initialPrefetchMode?: LinkPrefetchMode
  ): Promise<{
    fixture: ComponentFixture<TestScRouterLinkHost>;
    router: Router;
  }> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestScRouterLinkHost, BlankCmp],
      providers: [provideRouter([{ path: '**', component: BlankCmp }]), ...extraProviders],
    });
    const fixture = TestBed.createComponent(TestScRouterLinkHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    // Set inputs the directive should see on its very first render — this directive's
    // prefetch wiring is read once per `applyValue()` run, so exercising it here (rather
    // than mutating inputs after an initial render) matches real usage, where
    // `scRouterLinkPrefetch` is set once per link, not toggled at runtime.
    if (initialPrefetchMode !== undefined) {
      fixture.componentRef.setInput('prefetchMode', initialPrefetchMode);
    }
    fixture.detectChanges();
    return { fixture, router };
  }

  it('calls Router.navigateByUrl with href on click and preventDefault when no hash', async () => {
    const { fixture, router } = await createFixture();
    const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toContain('/about');

    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    const preventSpy = vi.spyOn(ev, 'preventDefault');
    a.dispatchEvent(ev);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('/about');
    expect(preventSpy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('calls navigateByUrl for href with hash and does not preventDefault', async () => {
    const { fixture, router } = await createFixture();
    const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.componentRef.setInput('field', {
      value: { href: '/page', text: 'Page', anchor: 'section', linktype: 'internal' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toContain('#');

    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    const preventSpy = vi.spyOn(ev, 'preventDefault');
    a.dispatchEvent(ev);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain('#');
    expect(preventSpy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('should not call Router.navigateByUrl when target is _blank so the browser can open a new tab', async () => {
    const { fixture, router } = await createFixture();
    const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.componentRef.setInput('field', {
      value: { href: '/external', text: 'Ext', target: '_blank', linktype: 'internal' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('target')).toBe('_blank');

    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    const preventSpy = vi.spyOn(ev, 'preventDefault');
    a.dispatchEvent(ev);

    expect(spy).not.toHaveBeenCalled();
    expect(preventSpy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('should not call Router.navigateByUrl when href is missing so the anchor does not router-navigate', async () => {
    const { fixture, router } = await createFixture();
    const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.componentRef.setInput('field', { value: { text: 'No href', linktype: 'internal' } });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.hasAttribute('href')).toBe(false);

    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    a.dispatchEvent(ev);

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('should not call Router.navigateByUrl when href is empty so in-app routing is skipped', async () => {
    const { fixture, router } = await createFixture();
    const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.componentRef.setInput('field', {
      value: { href: '', text: 'Empty href', linktype: 'internal' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe(null);

    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    a.dispatchEvent(ev);

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('should not call Router.navigateByUrl when href is only whitespace', async () => {
    const { fixture, router } = await createFixture();
    const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.componentRef.setInput('field', {
      value: { href: '   ', text: 'Whitespace href', linktype: 'internal' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    a.dispatchEvent(ev);

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it.each([
    'https://example.com/page',
    'http://example.com/',
    'mailto:user@example.com',
    'tel:+15551234567',
    'sms:+15551234567',
    'javascript:void(0)',
    'data:text/plain,hi',
    'ftp://files.example.com/',
    '//cdn.example.com/asset.js',
  ])(
    'should not call Router.navigateByUrl when href is a browser-handled URL (%s)',
    async (href) => {
      const { fixture, router } = await createFixture();
      const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

      fixture.componentRef.setInput('field', {
        value: { href, text: 'External', linktype: 'external' },
      });
      fixture.detectChanges();

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      expect(a.getAttribute('href')).toBe(href);

      const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
      a.dispatchEvent(ev);

      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    }
  );

  it('routes to the latest href after multiple field updates', async () => {
    const { fixture, router } = await createFixture();
    const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.componentRef.setInput('field', {
      value: { href: '/first', text: 'First' },
    });
    fixture.detectChanges();

    fixture.componentRef.setInput('field', {
      value: { href: '/second', text: 'Second' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    a.dispatchEvent(ev);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('/second');

    spy.mockRestore();
  });


  describe('link prefetch: hover mode (explicit — default is now eager, see "eager mode" below)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('calls ClientPreLoaderDataService.prefetchForUrl with the href and force:true after the configured delay', async () => {
      const { fixture } = await createFixture([], 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      expect(prefetchSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/about', { force: true });
    });

    it('re-arms after mouseleave and fires again on a subsequent hover', async () => {
      const { fixture } = await createFixture([], 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);
      a.dispatchEvent(new Event('mouseleave'));
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).toHaveBeenCalledTimes(2);
    });

    it('does not prefetch when mouseleave happens before the delay elapses', async () => {
      const { fixture } = await createFixture([], 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(50);
      a.dispatchEvent(new Event('mouseleave'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it('does not prefetch external links', async () => {
      const { fixture } = await createFixture([], 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: { href: 'https://example.com/page', text: 'Ext', linktype: 'external' },
      });
      fixture.detectChanges();

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it('does not prefetch target="_blank" links', async () => {
      const { fixture } = await createFixture([], 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: { href: '/external', text: 'Ext', target: '_blank', linktype: 'internal' },
      });
      fixture.detectChanges();

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it('does not prefetch when href is empty', async () => {
      const { fixture } = await createFixture([], 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: { href: '', text: 'Empty href', linktype: 'internal' },
      });
      fixture.detectChanges();

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('link prefetch: eager mode', () => {
    it('prefetches immediately on render with zero config (eager is the bare default)', async () => {
      const { fixture } = await createFixture();
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: { href: '/eager', text: 'Eager' } });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/eager');
    });

    it("prefetches immediately when the global config mode is explicitly 'eager'", async () => {
      const { fixture } = await createFixture([
        { provide: SITECORE_CONFIG_TOKEN, useValue: { angular: { linkPrefetch: { mode: 'eager', delayMs: 100 } } } },
      ]);
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: { href: '/eager', text: 'Eager' } });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/eager');
    });

    it('prefetches immediately via the per-link override even when the global default is disabled', async () => {
      const { fixture } = await createFixture(
        [
          {
            provide: SITECORE_CONFIG_TOKEN,
            useValue: { angular: { linkPrefetch: { mode: 'off', delayMs: 100 } } },
          },
        ],
        'eager'
      );
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: { href: '/eager', text: 'Eager' } });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/eager');
    });

    it('does not prefetch external links even in eager mode', async () => {
      const { fixture } = await createFixture([], 'eager');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: { href: 'https://example.com/page', text: 'Ext', linktype: 'external' },
      });
      fixture.detectChanges();

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it('does not prefetch target="_blank" links even in eager mode', async () => {
      const { fixture } = await createFixture([], 'eager');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: { href: '/external', text: 'Ext', target: '_blank', linktype: 'internal' },
      });
      fixture.detectChanges();

      expect(prefetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('link prefetch: disabled', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("suppresses prefetch when the per-link input is 'off', even though the global default is eager", async () => {
      const { fixture } = await createFixture([], 'off');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it("suppresses prefetch by default when angular.linkPrefetch.mode is 'off' in config", async () => {
      const { fixture } = await createFixture([
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: { angular: { linkPrefetch: { mode: 'off', delayMs: 100 } } },
        },
      ]);
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it('re-enables eager prefetch via the per-link input even when the global config is disabled', async () => {
      const { fixture } = await createFixture(
        [
          {
            provide: SITECORE_CONFIG_TOKEN,
            useValue: { angular: { linkPrefetch: { mode: 'off', delayMs: 100 } } },
          },
        ],
        'eager'
      );
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      // Spy attached after the initial (already-eager) render, so trigger a fresh one.
      fixture.componentRef.setInput('field', { value: { href: '/re-enabled', text: 'Re-enabled' } });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/re-enabled');
    });

    it('re-enables hover prefetch via the per-link input even when the global config is disabled', async () => {
      const { fixture } = await createFixture(
        [
          {
            provide: SITECORE_CONFIG_TOKEN,
            useValue: { angular: { linkPrefetch: { mode: 'off', delayMs: 100 } } },
          },
        ],
        'hover'
      );
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      a.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/about', { force: true });
    });
  });
});
