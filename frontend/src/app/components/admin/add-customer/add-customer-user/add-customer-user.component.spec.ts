import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerUserComponent } from './add-customer-user.component';

describe('AddCustomerUserComponent', () => {
  let component: AddCustomerUserComponent;
  let fixture: ComponentFixture<AddCustomerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomerUserComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
