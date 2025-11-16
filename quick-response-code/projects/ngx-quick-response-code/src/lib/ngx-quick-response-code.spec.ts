import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, SimpleChanges, SimpleChange } from '@angular/core';

import { QuickResponseCode } from './ngx-quick-response-code';
import { TESTS } from './utils/constants';


describe('NgxQuickResponseCode', () => {
  let component: QuickResponseCode;
  let fixture: ComponentFixture<QuickResponseCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickResponseCode],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickResponseCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  TESTS.forEach(CASE => {
    it('should match image size', () => {
      let change: SimpleChanges = {
        "text": new SimpleChange(component.text, CASE.TEXT, false)
      }; // TODO: find a better way.
      
      component.text = CASE.TEXT;
      component.ngOnChanges(change);

      expect(component.canvas.nativeElement.height).toEqual(CASE.SIZE);
    });
  });
});
