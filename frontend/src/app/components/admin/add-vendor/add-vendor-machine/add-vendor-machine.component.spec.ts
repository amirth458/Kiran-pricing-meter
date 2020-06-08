import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorMachineComponent } from './add-vendor-machine.component';

describe('AddVendorMachineComponent', () => {
  let component: AddVendorMachineComponent;
  let fixture: ComponentFixture<AddVendorMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorMachineComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
