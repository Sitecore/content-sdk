import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageComponent } from './image.component';

describe('ImageComponent', () => {
  let fixture: ComponentFixture<ImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ImageComponent] });
    fixture = TestBed.createComponent(ImageComponent);
  });

  it('should render nothing when field is undefined', () => {
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeNull();
  });

  it('should render nothing when src is missing', () => {
    fixture.componentRef.setInput('field', { value: { alt: 'test' } });
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeNull();
  });

  it('should render an img tag from ImageField (wrapped value)', () => {
    fixture.componentRef.setInput('field', { value: { src: '/img/hero.png', alt: 'Hero' } });
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('/img/hero.png');
    expect(img.getAttribute('alt')).toBe('Hero');
  });

  it('should render an img tag from bare ImageFieldValue', () => {
    fixture.componentRef.setInput('field', { src: '/img/promo.jpg', alt: 'Promo' });
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/img/promo.jpg');
  });

  it('should apply width and height attributes', () => {
    fixture.componentRef.setInput('field', { value: { src: '/img/hero.png', width: 800, height: 400 } });
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('width')).toBe('800');
    expect(img.getAttribute('height')).toBe('400');
  });

  it('should pass extra imageAttrs class to img', () => {
    fixture.componentRef.setInput('field', { value: { src: '/img/hero.png' } });
    fixture.componentRef.setInput('imageAttrs', { class: 'hero-img' });
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('class')).toBe('hero-img');
  });
});
