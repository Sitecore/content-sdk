/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { Component, input } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { ScRouterLinkDirective } from './sc-router-link.directive';
import type { LinkField } from '@sitecore-content-sdk/content/layout';

@Component({ standalone: true, template: '', selector: 'blank-cmp' })
class BlankCmp {}

@Component({
  selector: 'test-sc-router-link',
  imports: [ScRouterLinkDirective],
  template: `<a [scRouterLink]="field()">Label</a>`,
})
class TestScRouterLinkHost {
  readonly field = input<LinkField>({
    value: { href: '/about', text: 'About' },
  });
}

describe('ScRouterLinkDirective', () => {
  async function createFixture(): Promise<{
    fixture: ComponentFixture<TestScRouterLinkHost>;
    router: Router;
  }> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestScRouterLinkHost, BlankCmp],
      providers: [provideRouter([{ path: '**', component: BlankCmp }])],
    });
    const fixture = TestBed.createComponent(TestScRouterLinkHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
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
});
