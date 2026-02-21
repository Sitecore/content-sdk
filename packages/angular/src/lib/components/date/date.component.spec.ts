import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DateComponent } from './date.component';

describe('DateComponent', () => {
  let fixture: ComponentFixture<DateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DateComponent] });
    fixture = TestBed.createComponent(DateComponent);
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

  it('should render the raw ISO date string by default', () => {
    fixture.componentRef.setInput('field', { value: '2024-01-15T00:00:00Z' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2024-01-15T00:00:00Z');
  });

  it('should apply a custom render function', () => {
    fixture.componentRef.setInput('field', { value: '2024-06-01T00:00:00Z' });
    fixture.componentRef.setInput('render', (d: Date | null) => d?.getFullYear().toString() ?? '');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2024');
  });

  it('should call render function with a Date when value is set', () => {
    const renderFn = vi.fn().mockReturnValue('no date');
    fixture.componentRef.setInput('field', { value: '2024-06-01T00:00:00Z' });
    fixture.componentRef.setInput('render', renderFn);
    fixture.detectChanges();
    expect(renderFn).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should wrap content in given tag', () => {
    fixture.componentRef.setInput('field', { value: '2024-01-15T00:00:00Z' });
    fixture.componentRef.setInput('tag', 'time');
    fixture.detectChanges();
    const time = fixture.nativeElement.querySelector('time');
    expect(time).not.toBeNull();
  });
});
