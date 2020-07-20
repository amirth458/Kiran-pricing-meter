import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAcceptedComponent } from './customer-accepted.component';

describe('CustomerAcceptedComponent', () => {
  let component: CustomerAcceptedComponent;
  let fixture: ComponentFixture<CustomerAcceptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerAcceptedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
