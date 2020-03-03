import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingProfileDetailComponent } from './pricing-profile-detail.component';

describe('PricingProfileDetailComponent', () => {
  let component: PricingProfileDetailComponent;
  let fixture: ComponentFixture<PricingProfileDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingProfileDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
