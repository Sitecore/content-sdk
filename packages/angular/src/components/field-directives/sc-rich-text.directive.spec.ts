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

    it('prefetches every internal link immediately when the global config mode is explicitly true', () => {
      const fixture = createFixture([
        { provide: SITECORE_CONFIG_TOKEN, useValue: { angular: { linkPrefetch: { mode: true, delayMs: 100 } } } },
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
          useValue: { angular: { linkPrefetch: { mode: false, delayMs: 100 } } },
        },
      ]);
      fixture.componentRef.setInput('prefetchMode', true);
      const prefetchSpy = vi
        .spyOn(TestBed.inject(ClientPreLoaderDataService), 'prefetchForUrl')
        .mockImplementation(() => undefined);

      fixture.componentRef.setInput('field', { value: '<p><a href="/about">About</a></p>' });
      fixture.detectChanges();

      expect(prefetchSpy).toHaveBeenCalledExactlyOnceWith('/about');
    });

    it('does not prefetch external links even in eager mode', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('prefetchMode', true);
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

    it('suppresses prefetch when the per-field input is false, even though the global default is eager', () => {
      const fixture = createFixture();
      fixture.componentRef.setInput('prefetchMode', false);
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

    it('suppresses prefetch by default when angular.linkPrefetch.mode is false in config', () => {
      const fixture = createFixture([
        {
          provide: SITECORE_CONFIG_TOKEN,
          useValue: { angular: { linkPrefetch: { mode: false, delayMs: 100 } } },
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
          useValue: { angular: { linkPrefetch: { mode: false, delayMs: 100 } } },
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
          useValue: { angular: { linkPrefetch: { mode: false, delayMs: 100 } } },
        },
      ]);
      fixture.componentRef.setInput('prefetchMode', true);
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
});
