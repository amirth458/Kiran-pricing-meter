import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingSettingsComponent } from './pricing-settings.component';

describe('PricingSettingsComponent', () => {
  let component: PricingSettingsComponent;
  let fixture: ComponentFixture<PricingSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingSettingsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
