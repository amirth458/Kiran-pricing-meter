import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightPricingProfileComponent } from './insight-pricing-profile.component';

describe('InsightPricingProfileComponent', () => {
  let component: InsightPricingProfileComponent;
  let fixture: ComponentFixture<InsightPricingProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightPricingProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightPricingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
