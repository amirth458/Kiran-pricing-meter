import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerCompanyComponent } from './add-customer-company.component';

describe('AddCustomerCompanyComponent', () => {
  let component: AddCustomerCompanyComponent;
  let fixture: ComponentFixture<AddCustomerCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomerCompanyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
