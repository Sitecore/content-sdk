/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Component, input } from '@angular/core';
import { ScImageDirective, type ImageField } from './sc-image.directive';

@Component({
  selector: 'test-img',
  standalone: true,
  imports: [ScImageDirective],
  template: `<img [scImage]="field()" alt="" />`,
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

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.src).toContain('https://example.com/a.png');
    expect(img.alt).toBe('A');
  });

  it('should clear src when field empty', () => {
    const fixture = createFixture();
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.hasAttribute('src')).toBe(false);
  });
});
