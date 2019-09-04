import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPricingItemComponent } from './process-pricing-item.component';

describe('ProcessPricingItemComponent', () => {
  let component: ProcessPricingItemComponent;
  let fixture: ComponentFixture<ProcessPricingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessPricingItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessPricingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
