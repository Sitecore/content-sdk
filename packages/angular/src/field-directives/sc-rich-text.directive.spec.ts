/* eslint-disable jsdoc/require-jsdoc */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Component, input } from '@angular/core';
import { Field } from '@sitecore-content-sdk/content/layout';
import { ScRichTextDirective } from './sc-rich-text.directive';

@Component({
  selector: 'test-richtext',
  imports: [ScRichTextDirective],
  template: `<div [scRichText]="field()"></div>`,
})
class TestHostComponent {
  readonly field = input<Field<string> | undefined>(undefined);
}

describe('ScRichTextDirective', () => {
  function createFixture(): ComponentFixture<TestHostComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    return TestBed.createComponent(TestHostComponent);
  }

  it('should render HTML from field value', () => {
    const fixture = createFixture();
    fixture.componentRef.setInput('field', { value: '<p>Hello</p>' });
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(div.querySelector('p')?.textContent).toBe('Hello');
  });

  it('should clear when field empty', () => {
    const fixture = createFixture();
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(div.innerHTML).toBe('');
  });
});
