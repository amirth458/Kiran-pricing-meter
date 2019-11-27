import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingContainerComponent } from './pricing-container.component';

describe('PricingContainerComponent', () => {
  let component: PricingContainerComponent;
  let fixture: ComponentFixture<PricingContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
