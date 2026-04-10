/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Component, input } from '@angular/core';
import { ScLinkDirective } from './sc-link.directive';
import type { LinkField } from '@sitecore-content-sdk/content/layout';
import { getClassFromField } from './utils';

function sortedClassTokens(el: HTMLElement): string[] {
  return (el.className || '')
    .split(/\s+/)
    .filter(Boolean)
    .sort();
}

@Component({
  selector: 'test-link',
  standalone: true,
  imports: [ScLinkDirective],
  template: `<a [scLink]="field()"></a>`,
})
class TestHostComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

@Component({
  selector: 'test-link-host-class',
  standalone: true,
  imports: [ScLinkDirective],
  template: `<a class="host-base" [scLink]="field()"></a>`,
})
class TestHostWithHostClassComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

@Component({
  selector: 'test-link-host-title',
  standalone: true,
  imports: [ScLinkDirective],
  template: `<a title="Host title" [scLink]="field()"></a>`,
})
class TestHostWithHostTitleComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

@Component({
  selector: 'test-link-host-target',
  standalone: true,
  imports: [ScLinkDirective],
  template: `<a target="_self" [scLink]="field()"></a>`,
})
class TestHostWithHostTargetComponent {
  readonly field = input<LinkField | undefined>(undefined);
}

describe('ScLinkDirective', () => {
  function createFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    return TestBed.createComponent(TestHostComponent);
  }

  function createFixtureWithHostClass(): ComponentFixture<TestHostWithHostClassComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostWithHostClassComponent] });
    return TestBed.createComponent(TestHostWithHostClassComponent);
  }

  function createFixtureWithHostTitle(): ComponentFixture<TestHostWithHostTitleComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostWithHostTitleComponent] });
    return TestBed.createComponent(TestHostWithHostTitleComponent);
  }

  function createFixtureWithHostTarget(): ComponentFixture<TestHostWithHostTargetComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostWithHostTargetComponent] });
    return TestBed.createComponent(TestHostWithHostTargetComponent);
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

  it('should use combined class and className from field when both present', () => {
    // `getClassFromField` merges the way the React `addClassName` helper does; the directive passes
    // this string to `Renderer2.addClass`, which accepts one token at a time (split in directive if
    // both are present and you need both on the element).
    expect(
      getClassFromField({
        href: '/a',
        className: 'from-className',
        class: 'from-class',
      })
    ).toBe('from-className from-class');
  });

  it('should use className only when class is absent', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', className: 'only-className' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['only-className']);
  });

  it('should use class only when className is absent', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', class: 'only-class' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['only-class']);
  });

  it('should preserve original host class when applying class from field', () => {
    const fixture = createFixtureWithHostClass();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', className: 'from-field' },
    });
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['from-field', 'host-base'].sort());
  });

  it('should apply class from field then restore original host class when field class is cleared', () => {
    const fixture = createFixtureWithHostClass();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', className: 'temporary' },
    });
    fixture.detectChanges();

    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['host-base', 'temporary'].sort());

    fixture.componentRef.setInput('field', {
      value: { href: '/a' },
    });
    fixture.detectChanges();

    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(sortedClassTokens(a)).toEqual(['host-base']);
  });

  it('should apply title from field then restore original host title when field title is cleared', () => {
    const fixture = createFixtureWithHostTitle();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', title: 'From field' },
    });
    fixture.detectChanges();

    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('title')).toBe('From field');

    fixture.componentRef.setInput('field', {
      value: { href: '/a' },
    });
    fixture.detectChanges();

    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('title')).toBe('Host title');
  });

  it('should apply target from field then restore original host target when field target is cleared', () => {
    const fixture = createFixtureWithHostTarget();
    fixture.componentRef.setInput('field', {
      value: { href: '/a', target: '_blank' },
    });
    fixture.detectChanges();

    let a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.target).toBe('_blank');
    expect(a.rel).toBe('noopener noreferrer');

    fixture.componentRef.setInput('field', {
      value: { href: '/a' },
    });
    fixture.detectChanges();

    a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.target).toBe('_self');
  });
});
