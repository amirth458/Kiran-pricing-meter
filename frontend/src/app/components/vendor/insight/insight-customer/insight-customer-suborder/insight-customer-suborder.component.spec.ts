import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightCustomerSuborderComponent } from './insight-customer-suborder.component';

describe('InsightCustomerSuborderComponent', () => {
  let component: InsightCustomerSuborderComponent;
  let fixture: ComponentFixture<InsightCustomerSuborderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightCustomerSuborderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightCustomerSuborderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
