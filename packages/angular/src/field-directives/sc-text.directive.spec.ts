/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Component, input } from '@angular/core';
import { Field } from '@sitecore-content-sdk/content/layout';
import { ScTextDirective } from './sc-text.directive';

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [ScTextDirective],
  template: `<span [scText]="field()"></span>`,
})
class TestHostComponent {
  readonly field = input<Field<string> | undefined>(undefined);
}

@Component({
  selector: 'test-host-unencoded',
  standalone: true,
  imports: [ScTextDirective],
  template: `<span [scText]="field()" [scTextEncode]="false"></span>`,
})
class TestHostUnencodedComponent {
  readonly field = input<Field<string> | undefined>(undefined);
}

describe('ScTextDirective', () => {
  function createFixture<T>(component: new (...args: any[]) => T): ComponentFixture<T> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [component] });
    return TestBed.createComponent(component);
  }

  it('should render text value', () => {
    const fixture = createFixture(TestHostComponent);
    fixture.componentRef.setInput('field', { value: 'Hello World' });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent).toBe('Hello World');
  });

  it('should render empty when field is undefined', () => {
    const fixture = createFixture(TestHostComponent);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent).toBe('');
  });

  it('should render empty when field value is empty', () => {
    const fixture = createFixture(TestHostComponent);
    fixture.componentRef.setInput('field', { value: '' });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent).toBe('');
  });

  it('should render number values', () => {
    const fixture = createFixture(TestHostComponent);
    fixture.componentRef.setInput('field', { value: 42 });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent).toBe('42');
  });

  it('should use innerHTML when encode is false', () => {
    const fixture = createFixture(TestHostUnencodedComponent);
    fixture.componentRef.setInput('field', { value: '<strong>Bold</strong>' });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.querySelector('strong')?.textContent).toBe('Bold');
  });
});
