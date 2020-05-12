import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPricingSettingsComponent } from './production-pricing-settings.component';

describe('ProductionPricingSettingsComponent', () => {
  let component: ProductionPricingSettingsComponent;
  let fixture: ComponentFixture<ProductionPricingSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionPricingSettingsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPricingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
