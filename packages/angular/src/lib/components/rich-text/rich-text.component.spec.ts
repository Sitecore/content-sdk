import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RichTextComponent } from './rich-text.component';

describe('RichTextComponent', () => {
  let fixture: ComponentFixture<RichTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RichTextComponent] });
    fixture = TestBed.createComponent(RichTextComponent);
  });

  it('should render nothing when field is undefined', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should render nothing when field value is empty', () => {
    fixture.componentRef.setInput('field', { value: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should render HTML content', () => {
    fixture.componentRef.setInput('field', { value: '<p>Hello <strong>world</strong></p>' });
    fixture.detectChanges();
    const strong = fixture.nativeElement.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong.textContent).toBe('world');
  });

  it('should wrap content in given tag', () => {
    fixture.componentRef.setInput('field', { value: '<p>Content</p>' });
    fixture.componentRef.setInput('tag', 'section');
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('section');
    expect(section).not.toBeNull();
  });
});
