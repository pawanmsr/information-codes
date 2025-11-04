import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickResponseCode } from './ngx-quick-response-code';

describe('NgxQuickResponseCode', () => {
  let component: QuickResponseCode;
  let fixture: ComponentFixture<QuickResponseCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickResponseCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickResponseCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
