import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightCustomerOrderComponent } from './insight-customer-order.component';

describe('InsightCustomerOrderComponent', () => {
  let component: InsightCustomerOrderComponent;
  let fixture: ComponentFixture<InsightCustomerOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightCustomerOrderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
