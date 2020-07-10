import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVendorProcessPricingComponent } from './process-pricing.component';

describe('AdminVendorProcessPricingComponent', () => {
  let component: AdminVendorProcessPricingComponent;
  let fixture: ComponentFixture<AdminVendorProcessPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminVendorProcessPricingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVendorProcessPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
