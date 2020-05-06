import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionVendorDetailsComponent } from './production-vendor-details.component';

describe('ProductionVendorDetailsComponent', () => {
  let component: ProductionVendorDetailsComponent;
  let fixture: ComponentFixture<ProductionVendorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionVendorDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionVendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
