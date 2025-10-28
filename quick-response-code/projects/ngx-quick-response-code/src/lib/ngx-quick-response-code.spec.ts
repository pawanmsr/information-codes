import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxQuickResponseCode } from './ngx-quick-response-code';

describe('NgxQuickResponseCode', () => {
  let component: NgxQuickResponseCode;
  let fixture: ComponentFixture<NgxQuickResponseCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxQuickResponseCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxQuickResponseCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
