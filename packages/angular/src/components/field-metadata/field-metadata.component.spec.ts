import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldMetadataComponent } from './field-metadata.component';

describe('FieldMetadataComponent', () => {
  let fixture: ComponentFixture<FieldMetadataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FieldMetadataComponent] });
    fixture = TestBed.createComponent(FieldMetadataComponent);
  });

  it('should render two code tags', () => {
    fixture.componentRef.setInput('rendering', { componentName: 'Hero', uid: 'abc' });
    fixture.detectChanges();
    const codes = fixture.nativeElement.querySelectorAll('code');
    expect(codes.length).toBe(2);
  });

  it('should embed rendering data as JSON in the open code tag', () => {
    fixture.componentRef.setInput('rendering', { componentName: 'Hero', uid: 'abc' });
    fixture.detectChanges();
    const openCode = fixture.nativeElement.querySelector('code:first-child') as HTMLElement;
    const data = JSON.parse(openCode.getAttribute('data') ?? '{}');
    expect(data.componentName).toBe('Hero');
    expect(data.uid).toBe('abc');
  });
});
