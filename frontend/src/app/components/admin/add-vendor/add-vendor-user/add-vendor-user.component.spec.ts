import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorUserComponent } from './add-vendor-user.component';

describe('AddVendorUserComponent', () => {
  let component: AddVendorUserComponent;
  let fixture: ComponentFixture<AddVendorUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorUserComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
