import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightVendorSuborderComponent } from './insight-vendor-suborder.component';

describe('InsightVendorSuborderComponent', () => {
  let component: InsightVendorSuborderComponent;
  let fixture: ComponentFixture<InsightVendorSuborderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightVendorSuborderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightVendorSuborderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
