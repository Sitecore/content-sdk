import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LinkComponent] });
    fixture = TestBed.createComponent(LinkComponent);
  });

  it('should render nothing when field is undefined', () => {
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor).toBeNull();
  });

  it('should render an anchor from wrapped LinkField', () => {
    fixture.componentRef.setInput('field', { value: { href: '/about', text: 'About' } });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor).not.toBeNull();
    expect(anchor.getAttribute('href')).toBe('/about');
  });

  it('should render an anchor from bare LinkFieldValue', () => {
    fixture.componentRef.setInput('field', { href: '/contact', text: 'Contact' });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('href')).toBe('/contact');
  });

  it('should append querystring to href', () => {
    fixture.componentRef.setInput('field', { value: { href: '/search', querystring: 'q=test' } });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('href')).toBe('/search?q=test');
  });

  it('should append anchor hash to href', () => {
    fixture.componentRef.setInput('field', { value: { href: '/page', anchor: 'section1' } });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('href')).toBe('/page#section1');
  });

  it('should set target attribute', () => {
    fixture.componentRef.setInput('field', { value: { href: '/ext', target: '_blank' } });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('target')).toBe('_blank');
  });

  it('should render nothing when href is missing', () => {
    fixture.componentRef.setInput('field', { value: { text: 'No link' } });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor).toBeNull();
  });
});
