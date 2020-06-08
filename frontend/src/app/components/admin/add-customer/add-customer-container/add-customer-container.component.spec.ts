import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerContainerComponent } from './add-customer-container.component';

describe('AddCustomerContainerComponent', () => {
  let component: AddCustomerContainerComponent;
  let fixture: ComponentFixture<AddCustomerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomerContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
