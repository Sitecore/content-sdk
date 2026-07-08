/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { Component, input } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { Field } from '@sitecore-content-sdk/content/layout';
import { ScRichTextDirective } from './sc-rich-text.directive';
import {
  provideMockSitecoreContext,
  setMockContextPage,
} from '../../testing/mock-sitecore-context';

@Component({
  selector: 'test-richtext',
  imports: [ScRichTextDirective],
  template: `<div *scRichText="field()"></div>`,
})
class TestHostComponent {
  readonly field = input<Field<string> | undefined>(undefined);
}

describe('ScRichTextDirective', () => {
  function createFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([{ path: '**', component: TestHostComponent }])],
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
});
