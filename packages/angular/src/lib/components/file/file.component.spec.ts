import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileComponent } from './file.component';

describe('FileComponent', () => {
  let fixture: ComponentFixture<FileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FileComponent] });
    fixture = TestBed.createComponent(FileComponent);
  });

  it('should render nothing when field is undefined', () => {
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor).toBeNull();
  });

  it('should render nothing when src is missing', () => {
    fixture.componentRef.setInput('field', { value: { title: 'Doc' } });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor).toBeNull();
  });

  it('should render an anchor from wrapped FileField', () => {
    fixture.componentRef.setInput('field', { value: { src: '/media/doc.pdf', title: 'My Doc' } });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor).not.toBeNull();
    expect(anchor.getAttribute('href')).toBe('/media/doc.pdf');
  });

  it('should render an anchor from bare FileFieldValue', () => {
    fixture.componentRef.setInput('field', { src: '/media/file.pdf' });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('href')).toBe('/media/file.pdf');
  });

  it('should use title as link text', () => {
    fixture.componentRef.setInput('field', { value: { src: '/media/doc.pdf', title: 'Brochure' } });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.textContent?.trim()).toBe('Brochure');
  });

  it('should fall back to displayName when title is absent', () => {
    fixture.componentRef.setInput('field', {
      value: { src: '/media/doc.pdf', displayName: 'Product Sheet' },
    });
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.textContent?.trim()).toBe('Product Sheet');
  });
});
