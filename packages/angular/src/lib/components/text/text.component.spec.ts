import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TextComponent] });
    fixture = TestBed.createComponent(TextComponent);
  });

  it('should render nothing when field is undefined', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should render nothing when field value is empty string', () => {
    fixture.componentRef.setInput('field', { value: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should render plain text by default (encoded)', () => {
    fixture.componentRef.setInput('field', { value: 'Hello World' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hello World');
  });

  it('should HTML-encode special characters when encode=true', () => {
    fixture.componentRef.setInput('field', { value: '<script>alert(1)</script>' });
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).not.toContain('<script>');
    expect(fixture.nativeElement.textContent).toContain('<script>alert(1)</script>');
  });

  it('should convert newlines to <br> when encode=true', () => {
    fixture.componentRef.setInput('field', { value: 'line1\nline2' });
    fixture.detectChanges();
    const brs = fixture.nativeElement.querySelectorAll('br');
    expect(brs.length).toBeGreaterThanOrEqual(1);
  });

  it('should render raw HTML when encode=false', () => {
    fixture.componentRef.setInput('field', { value: '<strong>bold</strong>' });
    fixture.componentRef.setInput('encode', false);
    fixture.detectChanges();
    const strong = fixture.nativeElement.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong.textContent).toBe('bold');
  });

  it('should wrap content in the given tag', () => {
    fixture.componentRef.setInput('field', { value: 'Title' });
    fixture.componentRef.setInput('tag', 'h1');
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toContain('Title');
  });

  it('should render numeric field values', () => {
    fixture.componentRef.setInput('field', { value: 42 });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('42');
  });
});
