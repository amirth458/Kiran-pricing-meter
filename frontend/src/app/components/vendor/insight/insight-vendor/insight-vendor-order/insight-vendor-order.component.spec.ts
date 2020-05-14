import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightVendorOrderComponent } from './insight-vendor-order.component';

describe('InsightVendorOrderComponent', () => {
  let component: InsightVendorOrderComponent;
  let fixture: ComponentFixture<InsightVendorOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightVendorOrderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightVendorOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
