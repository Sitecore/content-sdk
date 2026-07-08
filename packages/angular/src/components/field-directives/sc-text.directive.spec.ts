/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Component, input } from '@angular/core';
import { Field } from '@sitecore-content-sdk/content/layout';
import { ScTextDirective } from './sc-text.directive';
import {
  provideMockSitecoreContext,
  setMockContextPage,
} from '../../testing/mock-sitecore-context';

@Component({
  selector: 'test-host',
  imports: [ScTextDirective],
  template: `<span *scText="field()"></span>`,
})
class TestHostComponent {
  readonly field = input<Field<string> | undefined>(undefined);
}

@Component({
  selector: 'test-host-unencoded',
  imports: [ScTextDirective],
  template: `<span *scText="field(); encode: false"></span>`,
})
class TestHostUnencodedComponent {
  readonly field = input<Field<string> | undefined>(undefined);
}

describe('ScTextDirective', () => {
  function createFixture<T>(component: new (..._args: any[]) => T): ComponentFixture<T> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [component] });
    return TestBed.createComponent(component);
  }

  it('should render text value into the wrapper element', () => {
    const fixture = createFixture(TestHostComponent);
    fixture.componentRef.setInput('field', { value: 'Hello World' });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span?.textContent).toBe('Hello World');
  });

  it('should omit the wrapper element entirely when field is undefined', () => {
    const fixture = createFixture(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span')).toBeNull();
  });

  it('should omit the wrapper element when field value is empty', () => {
    const fixture = createFixture(TestHostComponent);
    fixture.componentRef.setInput('field', { value: '' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span')).toBeNull();
  });

  it('should render number values', () => {
    const fixture = createFixture(TestHostComponent);
    fixture.componentRef.setInput('field', { value: 42 });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span?.textContent).toBe('42');
  });

  it('should use innerHTML when encode is false', () => {
    const fixture = createFixture(TestHostUnencodedComponent);
    fixture.componentRef.setInput('field', { value: '<strong>Bold</strong>' });
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span?.querySelector('strong')?.textContent).toBe('Bold');
  });
});

describe('ScTextDirective editing mode', () => {
  function createEditingFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: provideMockSitecoreContext(),
    });
    setMockContextPage({ mode: { isEditing: true } } as any);
    return TestBed.createComponent(TestHostComponent);
  }

  it('should wrap rendered text in <code class="scpm"> chrome markers when metadata is present', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: 'Hello',
      metadata: { contextItem: { id: 'x' }, fieldId: 'title' },
    });
    fixture.detectChanges();

    const markers = fixture.nativeElement.querySelectorAll('code.scpm');
    expect(markers.length).toBe(2);
    expect(markers[0].getAttribute('kind')).toBe('open');
    expect(markers[1].getAttribute('kind')).toBe('close');
    const opener = JSON.parse(markers[0].textContent ?? '{}');
    expect(opener.fieldId).toBe('title');
    expect(fixture.nativeElement.querySelector('span')?.textContent).toBe('Hello');
  });

  it('should render the default empty-field placeholder between chrome markers when field is empty + metadata present', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', {
      value: '',
      metadata: { contextItem: { id: 'x' }, fieldId: 'title' },
    });
    fixture.detectChanges();

    const markers = fixture.nativeElement.querySelectorAll('code.scpm');
    expect(markers.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('[No text in field]');
  });

  it('should render nothing when field is empty and no metadata is present, even in editing mode', () => {
    const fixture = createEditingFixture();
    fixture.componentRef.setInput('field', { value: '' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('code.scpm').length).toBe(0);
    expect(fixture.nativeElement.textContent).not.toContain('[No text in field]');
    expect(fixture.nativeElement.querySelector('span')).toBeNull();
  });
});
