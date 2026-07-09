/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Component, input } from '@angular/core';
import { ScImageDirective, type ImageField } from './sc-image.directive';
import {
  provideMockSitecoreContext,
  setMockContextPage,
} from '../../testing/mock-sitecore-context';

@Component({
  selector: 'test-img',
  imports: [ScImageDirective],
  template: `<img *scImage="field()" alt="" />`,
})
class TestHostComponent {
  readonly field = input<ImageField | undefined>(undefined);
}

describe('ScImageDirective', () => {
  function createFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    return TestBed.createComponent(TestHostComponent);
  }

  it('should set src from field value', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { src: 'https://example.com/a.png', alt: 'A' },
    });
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement | null;
    expect(img?.src).toContain('https://example.com/a.png');
    expect(img?.alt).toBe('A');
  });

  it('should set srcset when field value includes srcSet entries', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: {
        src: 'https://example.com/a.png',
        alt: 'A',
        srcSet: [
          { mw: 400, scale: 1 },
          { mw: 800, scale: 2 },
        ],
      },
    });
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement | null;
    expect(img?.getAttribute('srcset')).toBeTruthy();
    expect(img?.getAttribute('srcset')).toContain('400');
    expect(img?.getAttribute('srcset')).toContain('800');
  });

  it('should omit the img element when field is empty', () => {
    const fixture = createFixture();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });
});

describe('ScImageDirective editing mode', () => {
  function createEditingFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: provideMockSitecoreContext(),
    });
    setMockContextPage({ mode: { isEditing: true } } as any);
    return TestBed.createComponent(TestHostComponent);
  }

  it('should wrap rendered img in chrome markers when metadata is present', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: { src: 'https://example.com/a.png', alt: 'A' },
      metadata: { contextItem: { id: 'x' }, fieldId: 'image' },
    } as ImageField);
    fixture.detectChanges();

    const markers = fixture.nativeElement.querySelectorAll('code.scpm');
    expect(markers.length).toBe(2);
    expect(fixture.nativeElement.querySelector('img')?.getAttribute('src')).toContain(
      'https://example.com/a.png'
    );
  });

  it('should render the default empty image placeholder when field is empty + metadata present', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      metadata: { contextItem: { id: 'x' }, fieldId: 'image' },
    } as ImageField);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('code.scpm').length).toBe(2);
    expect(fixture.nativeElement.querySelector('img.scEmptyImage')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('img.scEmptyImage').getAttribute('src')).toBe(
      'data:image/svg+xml,%3Csvg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 240 240" style="enable-background:new 0 0 240 240;" xml:space="preserve"%3E%3Cstyle type="text/css"%3E .st0%7Bfill:none;%7D .st1%7Bfill:%23969696;%7D .st2%7Bfill:%23FFFFFF;%7D .st3%7Bfill:%23FFFFFF;stroke:%23FFFFFF;stroke-width:0.75;stroke-miterlimit:10;%7D%0A%3C/style%3E%3Cg%3E%3Crect class="st0" width="240" height="240"/%3E%3Cg%3E%3Cg%3E%3Crect x="20" y="20" class="st1" width="200" height="200"/%3E%3C/g%3E%3Cg%3E%3Ccircle class="st2" cx="174" cy="67" r="14"/%3E%3Cpath class="st2" d="M174,54c7.17,0,13,5.83,13,13s-5.83,13-13,13s-13-5.83-13-13S166.83,54,174,54 M174,52 c-8.28,0-15,6.72-15,15s6.72,15,15,15s15-6.72,15-15S182.28,52,174,52L174,52z"/%3E%3C/g%3E%3Cpolyline class="st3" points="29.5,179.25 81.32,122.25 95.41,137.75 137.23,91.75 209.5,179.75 "/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'
    );
  });
});
