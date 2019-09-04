import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPricingComponent } from './process-pricing.component';

describe('ProcessPricingComponent', () => {
  let component: ProcessPricingComponent;
  let fixture: ComponentFixture<ProcessPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
