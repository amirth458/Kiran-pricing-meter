import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingProfileComponent } from './pricing-profile.component';

describe('PricingProfileComponent', () => {
  let component: PricingProfileComponent;
  let fixture: ComponentFixture<PricingProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
