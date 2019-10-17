import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingEstimatorComponent } from './pricing-estimator.component';

describe('PricingEstimatorComponent', () => {
  let component: PricingEstimatorComponent;
  let fixture: ComponentFixture<PricingEstimatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingEstimatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingEstimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
