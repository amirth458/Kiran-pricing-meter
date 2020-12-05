import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingMeterDemoComponent } from './pricing-meter-demo.component';

describe('PricingMeterDemoComponent', () => {
  let component: PricingMeterDemoComponent;
  let fixture: ComponentFixture<PricingMeterDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingMeterDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingMeterDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
