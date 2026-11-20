/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Component, input, type Provider } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { Field } from '@sitecore-content-sdk/content/layout';
import { ScRichTextDirective } from './sc-rich-text.directive';
import { ClientPreLoaderDataService } from '../../loaders/pre-loader-data.service';
import { SITECORE_CONFIG_TOKEN } from '../../lib/tokens';
import type { LinkPrefetchMode } from '../../config/define-config';
import {
  provideMockSitecoreContext,
  setMockContextPage,
} from '../../testing/mock-sitecore-context';

@Component({
  selector: 'test-richtext',
  imports: [ScRichTextDirective],
  template: `<div *scRichText="field(); prefetch: prefetchMode()"></div>`,
})
class TestHostComponent {
  readonly field = input<Field<string> | undefined>(undefined);
  readonly prefetchMode = input<LinkPrefetchMode | undefined>(undefined);
}

describe('ScRichTextDirective', () => {
  function createFixture(extraProviders: Provider[] = []): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([{ path: '**', component: TestHostComponent }]),
        ...extraProviders,
      ],
    });
    return TestBed.createComponent(TestHostComponent);
  }

  it('should render HTML from field value', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', { value: '<p>Hello</p>' });
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div') as HTMLElement | null;
    expect(div?.querySelector('p')?.textContent).toBe('Hello');
  });

  it('should omit the wrapper element when field is empty', () => {
    const fixture = createFixture();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div')).toBeNull();
  });

  describe('javascript: URLs', () => {
    let errorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
      errorSpy.mockRestore();
    });

    it('removes a javascript: href, keeps the link text, and logs it', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('field', {
        value: '<p>Read <a class="x" href="javascript:alert(1)">this</a> and <a href="/ok">that</a></p>',
      });
      fixture.detectChanges();

      const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
      expect(links[0].textContent).toBe('this');
      expect(links[0].hasAttribute('href')).toBe(false);
      expect(links[0].getAttribute('class')).toBe('x');
      expect(links[1].getAttribute('href')).toBe('/ok');
      expect(errorSpy).toHaveBeenCalledOnce();
      expect(errorSpy.mock.calls[0][0]).toContain('javascript:alert(1)');
    });

    it('removes case, whitespace, and entity-encoded variants', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('field', {
        value:
          '<a href="JAVASCRIPT:void(0)">a</a><a href=" java\nscript:alert(1)">b</a><a href="&#106;avascript:alert(1)">c</a>',
      });
      fixture.detectChanges();

      const links = Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[];
      expect(links.map((a) => a.textContent)).toEqual(['a', 'b', 'c']);
      expect(links.every((a) => !a.hasAttribute('href'))).toBe(true);
      expect(errorSpy).toHaveBeenCalledTimes(3);
    });

    it('does not route a removed javascript: link through the router on click', async () => {
      const fixture = createFixture();
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/');
      const navSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

      fixture.componentRef.setInput('field', { value: '<a href="javascript:alert(1)">x</a>' });
      fixture.detectChanges();

      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(navSpy).not.toHaveBeenCalled();
      navSpy.mockRestore();
    });

    it('does not log again when change detection runs without a field change', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('field', { value: '<a href="javascript:void(0)">x</a>' });
      fixture.detectChanges();
      fixture.detectChanges();

      expect(errorSpy).toHaveBeenCalledOnce();
    });
  });

  it('routes internal links to the latest href after multiple field updates', async () => {
    const fixture = createFixture();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.componentRef.setInput('field', {
      value: '<p><a href="/one">One</a></p>',
    });
    fixture.detectChanges();

    fixture.componentRef.setInput('field', {
      value: '<p><a href="/two">Two</a></p>',
    });
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    anchor.dispatchEvent(ev);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('/two');

    spy.mockRestore();
  });

  describe('link prefetch: hover mode (explicit — default is now eager, see "eager mode" below)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('calls ClientPreLoaderDataService.prefetchForUrl with the href and force:true after the configured delay', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('prefetchMode', 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      anchor.dispatchEvent(new Event('mouseenter'));
      expect(prefetchSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/about', { force: true });
    });

    it('re-arms after mouseleave and fires again on a subsequent hover', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('prefetchMode', 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      anchor.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);
      anchor.dispatchEvent(new Event('mouseleave'));
      anchor.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).toHaveBeenCalledTimes(2);
    });

    it('does not prefetch when mouseleave happens before the delay elapses', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('prefetchMode', 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      anchor.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(50);
      anchor.dispatchEvent(new Event('mouseleave'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it('does not prefetch external links', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('prefetchMode', 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: '<p><a href="https://example.com/page">External</a></p>',
      });
      fixture.detectChanges();

      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      anchor.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('link prefetch: eager mode', () => {
    it('prefetches every internal link immediately on render with zero config (eager is the bare default)', () => {
      const fixture = createFixture();

      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: '<p><a href="/one">One</a> <a href="/two">Two</a></p>',
      });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledTimes(2);
      expect(prefetchSpy).toHaveBeenCalledWith('/one');
      expect(prefetchSpy).toHaveBeenCalledWith('/two');
    });

    it("prefetches every internal link immediately when the global config mode is explicitly 'eager'", () => {
      const fixture = createFixture([
        { provide: SITECORE_CONFIG_TOKEN, useValue: { angular: { linkPrefetch: { mode: 'eager', delayMs: 100 } } } },
      ]);
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: '<p><a href="/one">One</a> <a href="/two">Two</a></p>',
      });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledTimes(2);
      expect(prefetchSpy).toHaveBeenCalledWith('/one');
      expect(prefetchSpy).toHaveBeenCalledWith('/two');
    });

    it('prefetches immediately via the per-field override even when the global default is disabled', () => {
      const fixture = createFixture([
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: { angular: { linkPrefetch: { mode: 'off', delayMs: 100 } } },
        },
      ]);
      fixture.componentRef.setInput('prefetchMode', 'eager');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/about');
    });

    it('does not prefetch external links even in eager mode', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('prefetchMode', 'eager');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', {
        value: '<p><a href="https://example.com/page">External</a></p>',
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

    it("suppresses prefetch when the per-field input is 'off', even though the global default is eager", () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('prefetchMode', 'off');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      anchor.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it("suppresses prefetch by default when angular.linkPrefetch.mode is 'off' in config", () => {
      const fixture = createFixture([
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: { angular: { linkPrefetch: { mode: 'off', delayMs: 100 } } },
        },
      ]);
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      anchor.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it('re-enables hover prefetch via the per-field input even when the global config is disabled', () => {
      const fixture = createFixture([
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: { angular: { linkPrefetch: { mode: 'off', delayMs: 100 } } },
        },
      ]);
      fixture.componentRef.setInput('prefetchMode', 'hover');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
      anchor.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(100);

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/about', { force: true });
    });

    it('re-enables eager prefetch via the per-field input even when the global config is disabled', () => {
      const fixture = createFixture([
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: { angular: { linkPrefetch: { mode: 'off', delayMs: 100 } } },
        },
      ]);
      fixture.componentRef.setInput('prefetchMode', 'eager');
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/about');
    });
  });
});

describe('ScRichTextDirective editing mode', () => {
  function createEditingFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: provideMockSitecoreContext(),
    });
    setMockContextPage({ mode: { isEditing: true } } as any);
    return TestBed.createComponent(TestHostComponent);
  }

  it('should wrap rendered HTML in chrome markers when metadata is present', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: '<p>Body</p>',
      metadata: { contextItem: { id: 'x' }, fieldId: 'content' },
    });
    fixture.detectChanges();

    const markers = fixture.nativeElement.querySelectorAll('code.scpm');
    expect(markers.length).toBe(2);
    expect(markers[0].getAttribute('kind')).toBe('open');
    expect(markers[1].getAttribute('kind')).toBe('close');
    expect(fixture.nativeElement.querySelector('div')?.querySelector('p')?.textContent).toBe(
      'Body'
    );
  });

  it('should render the default empty placeholder between chrome markers when field is empty + metadata present', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: '',
      metadata: { contextItem: { id: 'x' }, fieldId: 'content' },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('code.scpm').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('[No text in field]');
    expect(fixture.nativeElement.querySelector('div')).toBeNull();
  });

  it('does not hijack internal link clicks while in editing mode', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: '<p><a href="/about">About</a></p>',
      metadata: { contextItem: { id: 'x' }, fieldId: 'content' },
    });
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    const preventSpy = vi.spyOn(ev, 'preventDefault');
    anchor.dispatchEvent(ev);

    expect(preventSpy).not.toHaveBeenCalled();
  });

  it('keeps editing chromes and removes a javascript: href', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: '<a class="edit-link" href="javascript:alert(1)">Click</a>',
      metadata: { contextItem: { id: 'x' }, fieldId: 'content' },
    });
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(fixture.nativeElement.querySelectorAll('code.scpm').length).toBe(2);
    expect(anchor.textContent).toBe('Click');
    expect(anchor.hasAttribute('href')).toBe(false);
    expect(anchor.getAttribute('class')).toBe('edit-link');
    expect(errorSpy).toHaveBeenCalledOnce();
    errorSpy.mockRestore();
  });

  it('does not attach prefetch (any mode) while in editing mode', () => {
    vi.useFakeTimers();
    const fixture = createEditingFixture();
    const prefetchSpy = vi
      .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
      .mockImplementation(() => undefined);

    fixture.componentRef.setInput('field', {
      value: '<p><a href="/about">About</a></p>',
      metadata: { contextItem: { id: 'x' }, fieldId: 'content' },
    });
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    anchor.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(100);

    expect(prefetchSpy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('does not attach prefetch (any mode, incl. eager) while in preview mode', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: provideMockSitecoreContext(),
    });
    setMockContextPage({ mode: { isPreview: true } } as any);
    const fixture = TestBed.createComponent(TestHostComponent);

    const prefetchSpy = vi
      .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
      .mockImplementation(() => undefined);

    // Eager is the default mode, so this also proves preview suppresses eager, not just hover.
    fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
    fixture.detectChanges();

    expect(prefetchSpy).not.toHaveBeenCalled();
  });
});
