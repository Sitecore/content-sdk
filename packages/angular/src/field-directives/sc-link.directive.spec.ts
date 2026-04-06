/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Component, input } from '@angular/core';
import { ScLinkDirective, type LinkField } from './sc-link.directive';

@Component({
  selector: 'test-link',
  standalone: true,
  imports: [ScLinkDirective],
  template: `<a [scLink]="field()"></a>`,
})
class TestHostComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

describe('ScLinkDirective', () => {
  function createFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    return TestBed.createComponent(TestHostComponent);
  }

  it('should set href and text from link field', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { href: '/about', text: 'About' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toContain('/about');
    expect(a.textContent).toBe('About');
  });

  it('should add noopener for _blank target', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { href: 'https://x.com', target: '_blank', text: 'X' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.target).toBe('_blank');
    expect(a.rel).toBe('noopener noreferrer');
  });
});
