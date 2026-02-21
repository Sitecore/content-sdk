import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MissingComponent } from './missing-component.component';

describe('MissingComponent', () => {
  let fixture: ComponentFixture<MissingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MissingComponent] });
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    fixture = TestBed.createComponent(MissingComponent);
  });

  afterEach(() => vi.restoreAllMocks());

  it('should display "Unnamed Component" when rendering has no componentName', () => {
    fixture.detectChanges();
    const h2 = fixture.nativeElement.querySelector('h2') as HTMLElement;
    expect(h2.textContent?.trim()).toBe('Unnamed Component');
  });

  it('should display the component name from the rendering input', () => {
    fixture.componentRef.setInput('rendering', { componentName: 'MyHero' });
    fixture.detectChanges();
    const h2 = fixture.nativeElement.querySelector('h2') as HTMLElement;
    expect(h2.textContent?.trim()).toBe('MyHero');
  });

  it('should log to console on init', () => {
    fixture.componentRef.setInput('rendering', { componentName: 'MyHero' });
    fixture.detectChanges();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('MyHero'),
      expect.anything()
    );
  });

  it('should render error message', () => {
    fixture.detectChanges();
    const p = fixture.nativeElement.querySelector('p') as HTMLElement;
    expect(p.textContent).toContain('missing Angular implementation');
  });
});
