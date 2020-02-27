import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedPricingComponent } from './recommended-pricing.component';

describe('RecommendedPricingComponent', () => {
  let component: RecommendedPricingComponent;
  let fixture: ComponentFixture<RecommendedPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedPricingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
